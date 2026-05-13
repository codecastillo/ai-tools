import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Tool } from '@/lib/types';
import { pickRelatedTools } from '@/lib/related';

interface Props {
  tool: Tool;
  all: Tool[];
}

export default function VersusCarousel({ tool, all }: Props) {
  const candidates = all.filter((t) => t.id !== tool.id);
  if (candidates.length < 2) return null;

  const related = pickRelatedTools(tool, all, 3);
  if (related.length < 2) return null;

  return (
    <section>
      <h3 className="text-sm uppercase tracking-wider text-ink-faint text-center mb-4">
        Versus
      </h3>
      <p className="text-xs text-ink-faint mt-1 text-center">
        How {tool.title} stacks up against similar tools.
      </p>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        {related.map((candidate) => (
          <Link
            key={candidate.id}
            href={`/compare/${tool.slug}/vs/${candidate.slug}`}
            className="group rounded-xl border border-line bg-surface-1 p-5 text-center hover:bg-surface-2 hover:border-line-2 transition"
          >
            <div className="flex items-center justify-center gap-3 text-[11px] uppercase tracking-wider text-ink-faint">
              <span className="h-px bg-surface-3 flex-1 max-w-[20px]" />
              vs
              <span className="h-px bg-surface-3 flex-1 max-w-[20px]" />
            </div>
            <div className="mt-3 text-base font-medium text-ink">
              {candidate.title}
            </div>
            <div className="mt-1 text-xs text-ink-mute line-clamp-2">
              {candidate.tagline}
            </div>
            <div className="mt-4 inline-flex items-center gap-1 text-xs text-accent group-hover:gap-2 transition-all">
              See comparison <ArrowRight className="h-3 w-3" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
