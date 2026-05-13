import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Tool } from '@/lib/types';

interface OftenComparedProps {
  tool: Tool;
  all: Tool[]; // approved tools (the current tool will be in this list; filter it)
}

function pickRelated(current: Tool, all: Tool[]): Tool | null {
  const candidates = all.filter((t) => t.id !== current.id);
  if (candidates.length === 0) return null;
  // 1. Same category, max tag overlap.
  const sameCat = candidates.filter(
    (t) => t.category === current.category && current.category !== null,
  );
  const scored = (pool: Tool[]) =>
    pool
      .map((t) => ({
        tool: t,
        score: t.tags.filter((tag) => current.tags.includes(tag)).length,
        curatedBonus: t.is_curated ? 1 : 0,
      }))
      .sort((a, b) => b.score + b.curatedBonus - (a.score + a.curatedBonus));
  if (sameCat.length > 0) {
    const ranked = scored(sameCat);
    if (ranked[0]) return ranked[0].tool;
  }
  // 2. Any curated tool with tag overlap.
  const curated = candidates.filter((t) => t.is_curated);
  if (curated.length > 0) {
    const ranked = scored(curated);
    if (ranked[0]) return ranked[0].tool;
  }
  // 3. Fallback: first candidate.
  return candidates[0];
}

export default function OftenCompared({ tool, all }: OftenComparedProps) {
  const related = pickRelated(tool, all);
  if (!related) return null;
  return (
    <section className="mt-10 border-t border-white/[0.06] pt-5">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-faint">
        Often compared with
      </p>
      <Link
        href={`/compare/${tool.slug}/vs/${related.slug}`}
        className="group mt-2 inline-flex items-center gap-2 text-lg font-semibold text-ink transition-colors hover:text-accent"
      >
        {related.title}
        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
      </Link>
      {related.tagline && (
        <p className="mt-1 line-clamp-2 text-sm text-ink-dim">{related.tagline}</p>
      )}
    </section>
  );
}
