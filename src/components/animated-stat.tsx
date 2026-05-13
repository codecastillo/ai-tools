'use client';

import { useEffect, useRef, useState } from 'react';

export interface AnimatedStatProps {
  value: number;
  label: string;
}

const DURATION_MS = 600;

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Renders <value> <label> where the number counts up from 0 to `value`
 * over ~600ms on mount. Snaps to final value under reduced motion.
 */
export default function AnimatedStat({ value, label }: AnimatedStatProps) {
  const [display, setDisplay] = useState(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // SSR-friendly: render the final value during SSR and snap if reduced.
    if (prefersReducedMotion() || value <= 0) {
      setDisplay(value);
      return;
    }
    let start: number | null = null;
    setDisplay(0);
    function step(ts: number) {
      if (start === null) start = ts;
      const elapsed = ts - start;
      const t = Math.min(1, elapsed / DURATION_MS);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * value));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDisplay(value);
      }
    }
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [value]);

  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="font-mono text-base font-semibold tabular-nums text-ink">
        {display}
      </span>
      <span className="text-ink-faint">{label}</span>
    </span>
  );
}
