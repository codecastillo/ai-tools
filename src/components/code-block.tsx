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

type AnimState = 'pre-reveal' | 'typing' | 'done';

// Adaptive per-character timing: every character is typed (no global duration
// cap), but the per-char interval shrinks for longer blocks so total time
// stays in a comfortable range. Do NOT reintroduce a global max-duration cap
// here — it caused long blocks to snap mid-stream after the first ~75 chars.
//   50-char block   → 10 ms/ch ≈ 500ms total
//   200-char block  →  4 ms/ch ≈ 800ms total
//   500-char block  →  3 ms/ch ≈ 1500ms total (clamped to min)
//   1000-char block →  3 ms/ch ≈ 3000ms total (clamped to min)
const TYPE_MS_PER_CHAR_MIN = 3;
const TYPE_MS_PER_CHAR_MAX = 10;
const TYPE_TARGET_TOTAL_MS = 800;

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

  // Start as 'done' on the server and on the first client render — we flip to
  // 'pre-reveal' inside an effect once we've decided to animate. This keeps
  // SSR markup identical to the non-animated state (no hydration mismatch).
  const [animState, setAnimState] = useState<AnimState>('done');
  const [typedCount, setTypedCount] = useState(0);

  // Stable derived values.
  const codeLength = code.length;
  const lineCount = useMemo(() => {
    if (!code) return 1;
    return Math.max(1, code.split('\n').length);
  }, [code]);
  // Approximate min-height of the body so the placeholder reserves space.
  // ~20px/line + 32px vertical padding (matches `[&_pre]:p-4` ≈ 16px each side).
  const minBodyHeightPx = lineCount * 20 + 32;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Decide whether to set up the IntersectionObserver. We only animate on
  // mount; if the user re-renders the page and the block is already in
  // view we'll detect that immediately and either fade-in (motion-safe)
  // or stay static.
  useEffect(() => {
    if (!animate) return;
    if (hasRunRef.current) return;
    if (typeof window === 'undefined') return;
    if (codeLength === 0) return;

    const el = wrapperRef.current;
    if (!el) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    // If IntersectionObserver isn't available, just bail to 'done'.
    if (typeof IntersectionObserver === 'undefined') return;

    // Start in pre-reveal so the highlighted HTML is hidden until we trigger.
    setAnimState('pre-reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (hasRunRef.current) break;
          hasRunRef.current = true;
          observer.disconnect();

          if (reduceMotion) {
            // Just reveal instantly.
            setAnimState('done');
            return;
          }

          // Begin typewriter.
          startTsRef.current = null;
          setTypedCount(0);
          setAnimState('typing');

          const msPerChar = Math.max(
            TYPE_MS_PER_CHAR_MIN,
            Math.min(
              TYPE_MS_PER_CHAR_MAX,
              TYPE_TARGET_TOTAL_MS / Math.max(1, codeLength),
            ),
          );
          const duration = msPerChar * codeLength;

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
              setAnimState('done');
            }
          };
          rafRef.current = requestAnimationFrame(step);
          break;
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animate, codeLength]);

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
  // During pre-reveal and typing, it stays hidden behind the overlay so the
  // typewriter has a stable target. Once 'done', it fades back in.
  const showHighlighted = animState === 'done';
  const showOverlay = animState === 'pre-reveal' || animState === 'typing';

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
        {/* Typewriter overlay. Sits on top during pre-reveal/typing. */}
        {showOverlay && (
          <pre
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 m-0 overflow-hidden p-4 font-mono text-[13px] leading-[1.55] text-ink-dim"
          >
            <code className="whitespace-pre">
              {code.slice(0, typedCount)}
              <span className="terminal-cursor text-accent">▍</span>
            </code>
          </pre>
        )}
      </div>
    </div>
  );
}
