'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { readRecents, RECENTS_EVENT, type RecentEntry } from '@/lib/recently-viewed';

export default function RecentlyViewed() {
  const [items, setItems] = useState<RecentEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setItems(readRecents());
    const onChange = () => setItems(readRecents());
    window.addEventListener(RECENTS_EVENT, onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener(RECENTS_EVENT, onChange);
      window.removeEventListener('storage', onChange);
    };
  }, []);

  if (!mounted || items.length === 0) return null;

  return (
    <section className="mt-10" aria-label="Recently viewed tools">
      <div className="flex items-center gap-2">
        <Clock className="h-3 w-3 text-ink-faint" aria-hidden="true" />
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">
          Recently viewed
        </span>
      </div>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((r) => (
          <li key={r.slug}>
            <Link
              href={`/tools/${r.slug}`}
              className="inline-flex items-center rounded-full border border-line-2 bg-surface-1 px-3 py-1 text-xs text-ink-dim transition-all hover:-translate-y-px hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
            >
              {r.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
