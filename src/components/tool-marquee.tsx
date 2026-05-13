'use client';

import Link from 'next/link';
import type { Tool } from '@/lib/types';

export interface ToolMarqueeProps {
  tools: Tool[];
}

/**
 * Horizontal scrolling strip of every tool name rendered as small chips.
 * Pauses on hover; doesn't overflow the viewport. The track loops by tiling
 * the list twice; the second pass is `aria-hidden` so screen readers and
 * keyboard users only ever see one canonical copy.
 */
export default function ToolMarquee({ tools }: ToolMarqueeProps) {
  if (tools.length === 0) return null;
  // Double the list so the loop seamlessly tiles.
  const repeated = [...tools, ...tools];
  return (
    <div className="rail-mask relative w-full overflow-hidden">
      <div className="marquee-track flex w-max gap-3 motion-reduce:animate-none">
        {repeated.map((t, i) => {
          const isClone = i >= tools.length;
          return (
            <Link
              key={`${t.id}-${i}`}
              href={`/tools/${t.slug}`}
              aria-hidden={isClone ? true : undefined}
              tabIndex={isClone ? -1 : 0}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-line-2 bg-surface-1 px-4 py-2 text-sm text-ink-dim transition-colors hover:border-accent/40 hover:bg-accent/10 hover:text-ink"
            >
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-accent/70"
              />
              {t.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
