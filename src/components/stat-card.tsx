'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import CountUp from '@/components/count-up';

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

      <div className="text-display mt-4 text-3xl text-ink tabular-nums">
        <CountUp to={value} />
      </div>

      <div className="mt-1 text-sm font-medium text-ink">{label}</div>
      {sublabel ? (
        <div className="mt-0.5 text-xs text-ink-faint">{sublabel}</div>
      ) : null}
    </div>
  );
}
