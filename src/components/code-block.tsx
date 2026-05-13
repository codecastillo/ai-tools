'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/cn';

// Run as a layout effect on the client (pre-paint) but fall back to a
// normal effect on the server so SSR doesn't warn. We use this to hide all
// code lines BEFORE the first browser paint, avoiding a flash of the
// fully-revealed SSR state before the typewriter starts.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface CodeBlockProps {
  html: string;
  code: string;
  lang?: string;
  /**
   * Optional override label for the language pill. Falls back to `lang`.
   */
  label?: string;
  /**
   * Hide the header row entirely (used by parent containers, e.g. OSTabs,
   * that supply their own header / tab strip).
   */
  hideHeader?: boolean;
  /**
   * If true (default), the block plays a one-shot line-reveal animation the
   * first time it scrolls into view. Already-in-view blocks reveal on mount.
   */
  animate?: boolean;
  className?: string;
}

// Animation timing constants. Total animation is clamped between these
// bounds; per-line delay is derived from total / lineCount.
const TOTAL_MIN_MS = 1200;
const TOTAL_MAX_MS = 2200;
const PER_LINE_MIN_MS = 90;
const PER_LINE_MAX_MS = 220;

/**
 * Inject `data-line-idx="N"` into every `<span class="line">` emitted by
 * Shiki, so each line is independently addressable from JS/CSS. We do this
 * as a pure string transform on the sanitized HTML so the server-rendered
 * markup already carries the index attributes. The client mounts the
 * existing DOM and just toggles per-line `opacity` for the reveal.
 *
 * Shiki keeps each line's spans on a single source line, so the per-line
 * wrapper is always `<span class="line">…</span>` with no nested newlines.
 * If the input doesn't contain any `<span class="line">` we fall back to
 * splitting the inner `<code>…</code>` body by `\n` and wrapping each
 * chunk ourselves.
 */
function annotateShikiLines(html: string): { html: string; lineCount: number } {
  const lineSpan = /<span class="line">/g;
  if (lineSpan.test(html)) {
    let idx = 0;
    const out = html.replace(/<span class="line">/g, () => {
      const tag = `<span class="line" data-line-idx="${idx}">`;
      idx += 1;
      return tag;
    });
    return { html: out, lineCount: Math.max(1, idx) };
  }
  // Fallback: split the <code> body on `\n` and wrap each line.
  const codeMatch = html.match(/(<code[^>]*>)([\s\S]*?)(<\/code>)/);
  if (!codeMatch) {
    return { html, lineCount: 1 };
  }
  const [, codeOpen, body, codeClose] = codeMatch;
  const lines = body.split('\n');
  const wrapped = lines
    .map(
      (line, i) =>
        `<span class="line" data-line-idx="${i}">${line}</span>`,
    )
    .join('\n');
  const next = html.replace(
    codeMatch[0],
    `${codeOpen}${wrapped}${codeClose}`,
  );
  return { html: next, lineCount: Math.max(1, lines.length) };
}

/**
 * Renders pre-sanitized Shiki HTML inside a styled surface with a
 * language pill and a copy-to-clipboard button.
 *
 * When `animate` is true (default), the block reveals each line one at a
 * time the first time it enters the viewport. Lines are toggled via direct
 * DOM `style.opacity` writes against the nodes React injected through
 * `dangerouslySetInnerHTML`. React doesn't reconcile those children, so
 * direct manipulation is safe.
 *
 * The Copy button always copies the original `code` string regardless of
 * animation state.
 */
export default function CodeBlock({
  html,
  code,
  lang,
  label,
  hideHeader = false,
  animate = true,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cursorRef = useRef<HTMLSpanElement | null>(null);
  const hasRunRef = useRef(false);

  // Pre-process the Shiki HTML once per `html` prop. The annotated HTML is
  // what we feed to `dangerouslySetInnerHTML`; the SSR pass renders the
  // exact same string so hydration markup matches.
  const { annotatedHtml, lineCount } = useMemo(() => {
    const r = annotateShikiLines(html);
    return { annotatedHtml: r.html, lineCount: r.lineCount };
  }, [html]);

  // One-time copy cleanup.
  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    };
  }, []);

  // Pre-paint: synchronously hide every line so the user never sees the
  // fully-revealed SSR markup between hydration and animation start. The
  // post-paint effect below then either reveals immediately (reduce-motion
  // / no observer / above-fold) or waits for scroll.
  useIsomorphicLayoutEffect(() => {
    if (!animate) return;
    if (hasRunRef.current) return;
    if (typeof window === 'undefined') return;
    const body = bodyRef.current;
    if (!body) return;
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reduceMotion) return;
    const lineNodes = body.querySelectorAll<HTMLElement>('[data-line-idx]');
    for (const n of lineNodes) {
      n.style.opacity = '0';
      n.style.transition = 'opacity 150ms ease-out';
    }
    // We intentionally do NOT set hasRunRef here. That flag is the gate
    // for the reveal driver below, which still needs to fire.
  }, [animate, lineCount]);

  // Drive the line-by-line reveal. Either kicks off immediately (block
  // already in view at mount) or wires up an IntersectionObserver to start
  // when the user scrolls to it.
  useEffect(() => {
    if (!animate) return;
    if (hasRunRef.current) return;
    if (typeof window === 'undefined') return;
    if (lineCount === 0) return;

    const body = bodyRef.current;
    const wrapper = wrapperRef.current;
    if (!body || !wrapper) return;

    const lineNodes = Array.from(
      body.querySelectorAll<HTMLElement>('[data-line-idx]'),
    );
    if (lineNodes.length === 0) {
      hasRunRef.current = true;
      return;
    }

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (reduceMotion) {
      // Snap to fully revealed. (The pre-paint hide is skipped under
      // reduce-motion so the lines are already at their natural opacity;
      // we still set explicitly to be safe.)
      for (const n of lineNodes) n.style.opacity = '1';
      hasRunRef.current = true;
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      // No observer support, just reveal everything immediately.
      for (const n of lineNodes) n.style.opacity = '1';
      hasRunRef.current = true;
      return;
    }

    // Pre-build a single cursor element we can reposition by appending it
    // to the current revealed line. CSS class `terminal-cursor` provides
    // the blink keyframes.
    const cursor = document.createElement('span');
    cursor.setAttribute('aria-hidden', 'true');
    cursor.className = 'terminal-cursor';
    cursor.style.display = 'inline-block';
    cursor.style.width = '0.55em';
    cursor.style.height = '1em';
    cursor.style.marginLeft = '2px';
    cursor.style.verticalAlign = '-0.1em';
    cursor.style.backgroundColor = 'var(--color-accent)';
    cursorRef.current = cursor;

    const startReveal = () => {
      if (hasRunRef.current) return;
      hasRunRef.current = true;

      // Per-line delay: clamp(TOTAL_MIN/lines, PER_LINE_MIN, TOTAL_MAX/lines)
      // guarantees the total animation lands within
      // [TOTAL_MIN_MS, TOTAL_MAX_MS] for any plausible line count, with
      // per-line delay bounded to a comfortable range.
      const rawDelay = Math.floor(TOTAL_MIN_MS / Math.max(1, lineCount));
      const maxDelay = Math.floor(TOTAL_MAX_MS / Math.max(1, lineCount));
      const delay = Math.max(
        PER_LINE_MIN_MS,
        Math.min(PER_LINE_MAX_MS, Math.max(rawDelay, Math.min(maxDelay, rawDelay))),
      );

      let current = 0;
      const reveal = (idx: number) => {
        const node = lineNodes[idx];
        if (!node) return;
        node.style.opacity = '1';
        // Move the cursor to sit at the end of this freshly-revealed line.
        // Appending to the line node keeps it visually attached to that
        // text run regardless of code-block scroll position.
        node.appendChild(cursor);
      };

      // Reveal the first line immediately so there's a visible starting
      // point, then tick the rest on the timer.
      reveal(current);
      current += 1;

      const tick = () => {
        if (current >= lineCount) {
          // Done. Drop the cursor.
          if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
          revealTimerRef.current = null;
          return;
        }
        reveal(current);
        current += 1;
        revealTimerRef.current = setTimeout(tick, delay);
      };
      revealTimerRef.current = setTimeout(tick, delay);
    };

    // Probe: if this block is already in the viewport at mount, start
    // immediately. IntersectionObserver can no-op for elements already in
    // view at hydration on certain browsers, so we don't rely on it for the
    // above-the-fold case.
    const rect = wrapper.getBoundingClientRect();
    const viewportH =
      window.innerHeight || document.documentElement.clientHeight || 0;
    const alreadyInView = rect.bottom > 0 && rect.top < viewportH;

    if (alreadyInView) {
      startReveal();
      return () => {
        if (revealTimerRef.current) {
          clearTimeout(revealTimerRef.current);
          revealTimerRef.current = null;
        }
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (hasRunRef.current) break;
          observer.disconnect();
          startReveal();
          break;
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(wrapper);
    return () => {
      observer.disconnect();
      if (revealTimerRef.current) {
        clearTimeout(revealTimerRef.current);
        revealTimerRef.current = null;
      }
    };
  }, [animate, lineCount]);

  const handleCopy = useCallback(async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(code);
      } else {
        // Fallback for older browsers / non-secure contexts.
        const ta = document.createElement('textarea');
        ta.value = code;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      // Silently fail. Clipboard permission denied, etc.
    }
  }, [code]);

  const displayLabel = (label ?? lang ?? 'text').toLowerCase();

  return (
    <div
      ref={wrapperRef}
      className={cn(
        'group my-4 overflow-hidden rounded-lg border border-line-2 bg-[--color-bg-elevated,#0a0a0a] text-[13px] shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_1px_2px_rgba(0,0,0,0.4)]',
        className,
      )}
    >
      {!hideHeader && (
        <div className="flex items-center justify-between border-b border-line px-3 py-1.5">
          <span className="font-mono text-[11px] uppercase tracking-wide text-ink-faint">
            {displayLabel}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? 'Copied' : 'Copy code'}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md border border-line bg-surface-1 px-2 py-1 text-[11px] font-medium text-ink-mute',
              'transition-colors hover:border-line-2 hover:bg-surface-3 hover:text-ink',
              'motion-reduce:transition-none',
            )}
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-accent" aria-hidden="true" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" aria-hidden="true" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      )}
      <span aria-live="polite" className="sr-only">
        {copied ? 'Code copied to clipboard' : ''}
      </span>
      <div
        ref={bodyRef}
        data-line-total={lineCount}
        className={cn(
          'relative overflow-x-auto',
          '[&_pre]:!bg-transparent [&_pre]:p-4 [&_pre]:m-0',
          '[&_code]:!bg-transparent [&_code]:!px-0 [&_code]:!py-0',
        )}
        dangerouslySetInnerHTML={{ __html: annotatedHtml }}
      />
    </div>
  );
}
