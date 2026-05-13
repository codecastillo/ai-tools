'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface StatCardProps {
  /** Pre-rendered icon JSX (e.g. <Library className="h-4 w-4" aria-hidden />).
   * Cannot be a component reference because that crosses the server/client boundary. */
  icon: ReactNode;
  value: number;
  label: string;
  sublabel?: string;
  /** Tailwind text-color class for the icon and accent corner. Defaults to coral. */
  tintClass?: string;
}

const DURATION_MS = 600;

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Count-up number sized for the stat-card display row. Mirrors the easing of
 * the shared `<AnimatedStat>` component but is rendered as a standalone block
 * so the parent can size it freely (the shared component hard-codes `text-base`).
 */
function CountUp({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
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

  return <span className="tabular-nums">{display}</span>;
}

/**
 * Chunky stat tile used in the homepage hero. Wraps a count-up number with an
 * icon-in-square wrapper and an optional sublabel beneath.
 */
export default function StatCard({
  icon,
  value,
  label,
  sublabel,
  tintClass = 'text-accent',
}: StatCardProps) {
  return (
    <div
      className={cn(
        'group flex flex-col items-center rounded-2xl border-[1.5px] border-line-2 bg-[--color-surface] p-5 text-center',
        'transition-transform duration-150 hover:-translate-y-px',
      )}
    >
      <span
        className={cn(
          'inline-flex h-9 w-9 items-center justify-center rounded-xl',
          'border border-line-2 bg-surface-2',
          tintClass,
        )}
      >
        {icon}
      </span>

      <div className="text-display mt-4 text-3xl text-ink">
        <CountUp value={value} />
      </div>

      <div className="mt-1 text-sm font-medium text-ink">{label}</div>
      {sublabel ? (
        <div className="mt-0.5 text-xs text-ink-faint">{sublabel}</div>
      ) : null}
    </div>
  );
}
