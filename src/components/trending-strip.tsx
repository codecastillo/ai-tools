import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import type { Tool } from '@/lib/types';
import { Sparkline } from './sparkline';

interface Props {
  tools: Tool[];
}

/**
 * Deterministic 5-point trend derived from a tool's popularity. Same input
 * always yields the same shape, so the strip is stable between renders while
 * still giving every tool a distinct silhouette that loosely tracks popularity.
 */
const trend = (p: number): number[] => {
  const seed = (p * 1000) | 0;
  return [0, 1, 2, 3, 4].map(
    (i) => Math.max(1, ((seed >> (i * 3)) & 0x1f) + (p / 4)),
  );
};

export function TrendingStrip({ tools }: Props) {
  const top = [...tools]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 8);

  if (top.length === 0) return null;

  return (
    <section className="overflow-hidden">
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center justify-center gap-2">
          <TrendingUp className="h-4 w-4 text-accent" />
          <h2 className="text-lg font-semibold text-ink">
            Trending this week
          </h2>
        </div>
        <p className="mt-1 text-sm text-ink-mute">
          Most viewed tools across the catalog.
        </p>
      </div>

      <div className="mt-6 flex gap-3 overflow-x-auto pb-3 rail-mask">
        {top.map((tool, i) => (
          <Link
            key={tool.id}
            href={`/tools/${tool.slug}`}
            className="flex-none w-56 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 text-center hover:bg-white/[0.05] hover:border-white/[0.15] transition"
          >
            <div className="flex items-center justify-start">
              <span className="text-[10px] uppercase tracking-wider text-ink-faint">
                #{i + 1}
              </span>
            </div>
            <div className="mt-2 text-sm font-medium text-ink">
              {tool.title}
            </div>
            <div className="mt-1 text-xs text-ink-mute line-clamp-2">
              {tool.tagline}
            </div>
            <div className="mt-3 flex items-center justify-center gap-2">
              <Sparkline values={trend(tool.popularity)} />
              <span className="text-xs text-success">
                +{tool.popularity}%
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default TrendingStrip;
