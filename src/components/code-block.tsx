'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/cn';

interface CodeBlockProps {
  html: string;
  code: string;
  lang?: string;
  /**
   * Optional override label for the language pill. Falls back to `lang`.
   */
  label?: string;
  /**
   * Hide the header row entirely (used by parent containers — e.g. OSTabs —
   * that supply their own header / tab strip).
   */
  hideHeader?: boolean;
  /**
   * If true (default), the block plays a one-shot typewriter animation the
   * first time it scrolls into view. Already-in-view blocks skip the anim.
   */
  animate?: boolean;
  className?: string;
}

type AnimState = 'pre-reveal' | 'typing' | 'finishing' | 'done';

// Adaptive per-character timing: every character is typed (no global duration
// cap), but the per-char interval shrinks for longer blocks so total time
// stays in a comfortable range. Do NOT reintroduce a global max-duration cap
// here — it caused long blocks to snap mid-stream after the first ~75 chars.
//   50-char block   → 10 ms/ch ≈ 500ms total → floor 700ms (≥20-char rule)
//   200-char block  →  4 ms/ch ≈ 800ms total
//   500-char block  →  3 ms/ch ≈ 1500ms total (clamped to min)
//   1000-char block →  3 ms/ch ≈ 3000ms total (clamped to min)
const TYPE_MS_PER_CHAR_MIN = 3;
const TYPE_MS_PER_CHAR_MAX = 10;
const TYPE_TARGET_TOTAL_MS = 800;
/** Any block this long or longer must take at least MIN_TOTAL_DURATION_MS. */
const MIN_DURATION_CHAR_THRESHOLD = 20;
const MIN_TOTAL_DURATION_MS = 700;

/**
 * Renders pre-sanitized Shiki HTML inside a styled surface with a
 * language pill and a copy-to-clipboard button.
 *
 * When `animate` is true (default), the block plays a one-shot typewriter
 * reveal the first time it enters the viewport. The Copy button always
 * copies the original `code` string regardless of animation state.
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
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const startTsRef = useRef<number | null>(null);
  const hasRunRef = useRef(false);

  // Stable derived values.
  const codeLength = code.length;
  const lineCount = useMemo(() => {
    if (!code) return 1;
    return Math.max(1, code.split('\n').length);
  }, [code]);
  // Approximate min-height of the body so the placeholder reserves space.
  // ~20px/line + 32px vertical padding (matches `[&_pre]:p-4` ≈ 16px each side).
  const minBodyHeightPx = lineCount * 20 + 32;

  // Lazy initial state so we can decide synchronously at first render whether
  // we'll need to animate. SSR / non-window contexts always get 'done' to
  // keep hydration markup stable. Once hydrated, the effect below either
  // kicks off typing immediately (already-in-view) or sets up the observer.
  const [animState, setAnimState] = useState<AnimState>(() => {
    if (typeof window === 'undefined') return 'done';
    if (!animate) return 'done';
    if (code.length === 0) return 'done';
    if (typeof IntersectionObserver === 'undefined') return 'done';
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reduceMotion) return 'done';
    // We'll commit the real decision (immediate vs observer) in the effect.
    return 'pre-reveal';
  });
  const [typedCount, setTypedCount] = useState(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Drive the typewriter. Either kicks off immediately (block already in
  // view at mount) or wires up an IntersectionObserver to start when the
  // user scrolls to it.
  useEffect(() => {
    if (!animate) return;
    if (hasRunRef.current) return;
    if (typeof window === 'undefined') return;
    if (codeLength === 0) return;
    if (animState === 'done') return; // Already finalized (reduce-motion etc.)

    const el = wrapperRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setAnimState('done');
      return;
    }

    const startTyping = () => {
      if (hasRunRef.current) return;
      hasRunRef.current = true;

      startTsRef.current = null;
      setTypedCount(0);
      setAnimState('typing');

      const baseMsPerChar = Math.max(
        TYPE_MS_PER_CHAR_MIN,
        Math.min(
          TYPE_MS_PER_CHAR_MAX,
          TYPE_TARGET_TOTAL_MS / Math.max(1, codeLength),
        ),
      );
      const baseDuration = baseMsPerChar * codeLength;
      // Floor: ≥20-char blocks must take ≥700ms so they feel like typewriters.
      const duration =
        codeLength >= MIN_DURATION_CHAR_THRESHOLD
          ? Math.max(MIN_TOTAL_DURATION_MS, baseDuration)
          : baseDuration;

      const step = (ts: number) => {
        if (startTsRef.current == null) startTsRef.current = ts;
        const elapsed = ts - startTsRef.current;
        const progress = Math.min(1, elapsed / duration);
        const next = Math.floor(progress * codeLength);
        setTypedCount(next);
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          rafRef.current = null;
          // 'finishing' = highlighted body becomes visible at opacity-1,
          // overlay stays mounted for one more frame to avoid a font-metric
          // flash, then we transition to 'done' which unmounts the overlay.
          setAnimState('finishing');
          rafRef.current = requestAnimationFrame(() => {
            rafRef.current = requestAnimationFrame(() => {
              setAnimState('done');
            });
          });
        }
      };
      rafRef.current = requestAnimationFrame(step);
    };

    // Probe: if this block is already in the viewport at mount, start
    // immediately. IntersectionObserver can sometimes no-op for elements
    // already in view at hydration on certain browsers, so we don't rely
    // on it for the above-the-fold case.
    const rect = el.getBoundingClientRect();
    const viewportH =
      window.innerHeight || document.documentElement.clientHeight || 0;
    const alreadyInView = rect.bottom > 0 && rect.top < viewportH;

    if (alreadyInView) {
      startTyping();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (hasRunRef.current) break;
          observer.disconnect();
          startTyping();
          break;
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animate, codeLength, animState]);

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
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      // Silently fail — clipboard permission denied, etc.
    }
  }, [code]);

  const displayLabel = (label ?? lang ?? 'text').toLowerCase();

  // Visibility of the highlighted (shiki) body.
  // During pre-reveal/typing it stays hidden behind the overlay. Once
  // typing completes we enter 'finishing' for one frame so the highlighted
  // body paints at opacity-1 before the overlay is unmounted on the next
  // frame — prevents a font-metric flash at the swap.
  const showHighlighted =
    animState === 'finishing' || animState === 'done';
  const showOverlay =
    animState === 'pre-reveal' ||
    animState === 'typing' ||
    animState === 'finishing';

  return (
    <div
      ref={wrapperRef}
      className={cn(
        'group my-4 overflow-hidden rounded-lg border border-white/[0.10] bg-[--color-bg-elevated,#0a0a0a] text-[13px] shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_1px_2px_rgba(0,0,0,0.4)]',
        className,
      )}
    >
      {!hideHeader && (
        <div className="flex items-center justify-between border-b border-white/[0.06] px-3 py-1.5">
          <span className="font-mono text-[11px] uppercase tracking-wide text-ink-faint">
            {displayLabel}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? 'Copied' : 'Copy code'}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.02] px-2 py-1 text-[11px] font-medium text-ink-mute',
              'transition-colors hover:border-white/[0.16] hover:bg-white/[0.06] hover:text-ink',
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
        className="relative"
        style={
          showOverlay ? { minHeight: `${minBodyHeightPx}px` } : undefined
        }
      >
        {/* Highlighted (final) body. We render it always so the DOM is stable;
            we just toggle visibility to hand off from the typewriter overlay. */}
        <div
          aria-hidden={!showHighlighted}
          className={cn(
            'overflow-x-auto [&_pre]:!bg-transparent [&_pre]:p-4 [&_pre]:m-0 [&_code]:!bg-transparent [&_code]:!px-0 [&_code]:!py-0',
            'transition-opacity duration-200 motion-reduce:transition-none',
            showHighlighted ? 'opacity-100' : 'opacity-0',
          )}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {/* Typewriter overlay. Sits on top during pre-reveal/typing/finishing. */}
        {showOverlay && (
          <pre
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 m-0 overflow-hidden p-4 font-mono text-[13px] leading-[1.55] text-ink-dim"
          >
            <code className="whitespace-pre">
              {code.slice(0, typedCount)}
              {animState !== 'finishing' && (
                <span className="terminal-cursor text-accent">▍</span>
              )}
            </code>
          </pre>
        )}
      </div>
    </div>
  );
}
