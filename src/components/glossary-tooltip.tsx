'use client';

import Link from 'next/link';
import { useState } from 'react';
import { findGlossaryTerm } from '@/lib/glossary';

interface Props {
  slug: string;
  children: React.ReactNode;
}

export default function GlossaryTooltip({ slug, children }: Props) {
  const term = findGlossaryTerm(slug);
  const [open, setOpen] = useState<boolean>(false);

  if (!term) {
    return <>{children}</>;
  }

  const show = () => setOpen(true);
  const hide = () => setOpen(false);

  return (
    <span
      className="relative inline-block cursor-help underline decoration-dotted decoration-white/30 underline-offset-4"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      tabIndex={0}
    >
      {children}
      {open ? (
        <div
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 rounded-lg border border-line-2 bg-[#0e0a08] p-3 text-xs text-ink-dim shadow-xl z-50"
        >
          <div className="text-sm font-medium text-ink">{term.term}</div>
          <div className="mt-1 text-ink-faint italic">{term.short}</div>
          <Link
            href={`/glossary#term-${term.slug}`}
            className="mt-2 inline-block text-accent hover:text-accent-bright"
          >
            Learn more
          </Link>
        </div>
      ) : null}
    </span>
  );
}
