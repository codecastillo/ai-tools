import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Tool } from '@/lib/types';
import { pickRelatedTools } from '@/lib/related';

interface OftenComparedProps {
  tool: Tool;
  all: Tool[]; // approved tools (the current tool will be in this list; filter it)
}

export default function OftenCompared({ tool, all }: OftenComparedProps) {
  const related = pickRelatedTools(tool, all, 1)[0] ?? null;
  if (!related) return null;
  return (
    <section className="mt-10 border-t border-line pt-5 text-center">
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
        <p className="mx-auto mt-1 line-clamp-2 max-w-md text-sm text-ink-dim">{related.tagline}</p>
      )}
    </section>
  );
}
