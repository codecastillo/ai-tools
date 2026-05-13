'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Layers } from 'lucide-react';
import { getDraft, onDraftChange } from '@/lib/draft-stack';

export default function StackPill() {
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCount(getDraft().length);
    const unsub = onDraftChange((ids) => setCount(ids.length));
    return unsub;
  }, []);

  if (!mounted || count === 0) return null;

  return (
    <Link
      href="/stack/builder"
      aria-label={`Open stack builder · ${count} ${count === 1 ? 'tool' : 'tools'}`}
      className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2.5 rounded-full border border-accent/30 bg-[--color-surface]/85 px-4 py-2.5 text-sm font-medium text-ink shadow-lg shadow-accent/10 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:bg-[--color-surface-hover]/90 hover:shadow-xl hover:shadow-accent/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
    >
      <Layers className="h-4 w-4 text-accent" />
      <span>
        Building stack <span className="text-ink-faint">·</span>{' '}
        <span className="tabular-nums">{count}</span>{' '}
        <span className="text-ink-dim">{count === 1 ? 'tool' : 'tools'}</span>
      </span>
      <ArrowRight className="h-4 w-4 text-ink-mute transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
