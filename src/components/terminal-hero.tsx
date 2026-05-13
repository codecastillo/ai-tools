'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import type { Tool } from '@/lib/types';

// Use layout effect on the client only, avoiding the SSR warning while
// still letting us reset state before the first browser paint, so users
// don't see a flash of "fully typed" before the typewriter begins.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export interface TerminalHeroProps {
  /**
   * Tool list is accepted to preserve the callsite contract from
   * src/app/page.tsx, but the hero now renders a single hard-coded demo so
   * nothing actually cycles. Kept as a prop in case future variants want to
   * pick a specific tool from the catalog.
   */
  tools?: Tool[];
}

/** Per-character cadence for the prompt typing. ~75ms reads as deliberate. */
const PROMPT_CHAR_MS = 75;
/** Settle beat before the first output line starts revealing. */
const PROMPT_TO_OUTPUT_MS = 350;
/** Delay between each output line revealing. */
const LINE_STAGGER_MS = 250;

/**
 * Single hard-coded terminal demo. We deliberately do NOT cycle through
 * tools any more, the prior cross-fade caused layout-flash on transition.
 *
 * Status glyphs use ASCII markers ([~], [ok]) to stay within the no-emoji /
 * no-dingbat rule.
 */
const DEMO = {
  title: 'claude-code',
  prompt: 'claude "refactor this React component to use hooks"',
  output: [
    '[~] analyzing component structure...',
    '[ok] identified 3 class-based lifecycle methods',
    '[ok] converted to useEffect / useState',
    '[ok] verified tests still pass',
    'done in 2.4s',
  ],
};

/**
 * Hero terminal. Renders the FULL final content on first paint so SSR is not
 * a blank shell. The client mount remounts the state and re-types the prompt,
 * then reveals each output line on a small stagger. No looping, no tool
 * switching. Page reload re-runs the type once.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function TerminalHero(_props: TerminalHeroProps) {
  // SSR path renders everything fully typed so there's no zero-content flash
  // before hydration. Client mount sets `mounted` true and resets state to 0,
  // then the animation engine below progressively reveals.
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [typedChars, setTypedChars] = useState(DEMO.prompt.length);
  const [revealedLines, setRevealedLines] = useState(DEMO.output.length);

  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const clearAllTimers = () => {
    for (const t of timersRef.current) clearTimeout(t);
    timersRef.current = [];
  };

  // Mount: decide reduced-motion path, otherwise reset to 0 and let the
  // animation engine effect drive the reveal. Layout effect so the reset
  // happens before paint, so no flash of "fully typed" between hydration and
  // animation start.
  useIsomorphicLayoutEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setReducedMotion(true);
      setTypedChars(DEMO.prompt.length);
      setRevealedLines(DEMO.output.length);
      return;
    }
    setTypedChars(0);
    setRevealedLines(0);
  }, []);

  // Type the prompt one character at a time.
  useEffect(() => {
    if (!mounted || reducedMotion) return;
    if (typedChars >= DEMO.prompt.length) return;
    const t = setTimeout(() => {
      setTypedChars((c) => c + 1);
    }, PROMPT_CHAR_MS);
    timersRef.current.push(t);
    return () => clearTimeout(t);
  }, [mounted, reducedMotion, typedChars]);

  // After prompt finishes, reveal output lines one by one.
  useEffect(() => {
    if (!mounted || reducedMotion) return;
    if (typedChars < DEMO.prompt.length) return;
    if (revealedLines >= DEMO.output.length) return;
    const delay = revealedLines === 0 ? PROMPT_TO_OUTPUT_MS : LINE_STAGGER_MS;
    const t = setTimeout(() => {
      setRevealedLines((n) => n + 1);
    }, delay);
    timersRef.current.push(t);
    return () => clearTimeout(t);
  }, [mounted, reducedMotion, typedChars, revealedLines]);

  // Unmount cleanup.
  useEffect(() => {
    return () => clearAllTimers();
  }, []);

  const promptDone = typedChars >= DEMO.prompt.length;
  const allOutputDone = revealedLines >= DEMO.output.length;
  // Show the typing caret on the prompt while it's still typing. Once the
  // prompt is fully typed, the caret hops down to the trailing empty output
  // line (rendered below).
  const promptTyped = DEMO.prompt.slice(0, typedChars);

  return (
    <div
      className={cn(
        'w-full rounded-2xl border-2 border-white/[0.08]',
        'bg-[#14121C]/95 shadow-elevated overflow-hidden',
        'backdrop-blur-sm',
      )}
      role="img"
      aria-label="Terminal preview of running Claude Code to refactor a React component"
    >
      {/* macOS-style chrome bar */}
      <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
          <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
          <span className="h-3 w-3 rounded-full bg-[#28C840]" />
        </div>
        <div className="flex-1" />
        <span className="font-mono text-[11px] text-ink-faint tracking-tight">
          {DEMO.title}
        </span>
      </div>

      {/* Body. The animated content is decorative. SR users get an accurate
          summary via aria-label on the outer container instead of having the
          per-character typing announced. */}
      <div
        className="font-mono text-[14px] sm:text-[15px] leading-relaxed p-6 sm:p-8"
        aria-hidden="true"
      >
        {/* Prompt line. */}
        <div className="flex items-baseline whitespace-pre overflow-hidden">
          <span className="text-accent font-semibold">$ </span>
          <span className="text-ink truncate">{promptTyped}</span>
          {!promptDone && (
            <span
              aria-hidden="true"
              className="inline-block w-2 h-[1em] bg-accent translate-y-0.5 ml-0.5 terminal-cursor"
            />
          )}
        </div>

        {/* Output lines. Each reveals via opacity transition. */}
        {DEMO.output.map((line, i) => {
          const visible = i < revealedLines;
          const isOk = line.startsWith('[ok]');
          const isProgress = line.startsWith('[~]');
          return (
            <div
              key={i}
              className={cn(
                'mt-1.5 flex items-baseline gap-2 transition-opacity duration-150',
                visible ? 'opacity-100' : 'opacity-0',
                i === 0 && 'mt-3',
              )}
            >
              <span
                className={cn(
                  'shrink-0',
                  isOk
                    ? 'text-success'
                    : isProgress
                      ? 'text-accent-2'
                      : 'text-ink-faint',
                )}
              >
                {isOk ? '[ok]' : isProgress ? '[~]' : '  '}
              </span>
              <span className="text-ink-dim truncate">
                {isOk
                  ? line.slice(5)
                  : isProgress
                    ? line.slice(4)
                    : line}
              </span>
            </div>
          );
        })}

        {/* Trailing empty line with a blinking cursor once the prompt is
            fully typed. Disappears for reduced-motion to keep the surface
            calm. */}
        <div className="mt-3 flex items-baseline">
          {promptDone && allOutputDone && !reducedMotion && (
            <span
              aria-hidden="true"
              className="inline-block w-2 h-[1em] bg-accent translate-y-0.5 terminal-cursor"
            />
          )}
        </div>
      </div>
    </div>
  );
}
