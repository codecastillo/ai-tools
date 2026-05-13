import Link from 'next/link';
import type { Tool } from '@/lib/types';
import { pickRelatedTools } from '@/lib/related';
import { categoryStyle } from '@/lib/categories';
import { cn } from '@/lib/cn';

interface ToolRelatedProps {
  tool: Tool;
  all: Tool[];
}

export default function ToolRelated({ tool, all }: ToolRelatedProps) {
  const related = pickRelatedTools(tool, all, 3);
  if (related.length === 0) return null;
  return (
    <section className="mt-10 border-t border-white/[0.10] pt-5">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-faint">
        Related tools
      </p>
      <ul className="mt-3 grid gap-3 sm:grid-cols-3">
        {related.map((t) => (
          <RelatedCard key={t.id} tool={t} />
        ))}
      </ul>
    </section>
  );
}

function RelatedCard({ tool }: { tool: Tool }) {
  const cat = categoryStyle(tool.category);
  return (
    <li>
      <Link
        href={`/tools/${tool.slug}`}
        className={cn(
          'group block h-full rounded-lg border border-white/[0.08] bg-white/[0.02] p-4 text-center',
          'transition-all hover:-translate-y-0.5 hover:border-accent/30 hover:bg-accent/[0.04]',
        )}
      >
        <div className="flex items-center justify-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.12em]">
          <span className={cn('h-1.5 w-1.5 rounded-full', cat.dotClass)} />
          <span className={cat.textClass}>{cat.short}</span>
        </div>
        <p className="mt-2 text-sm font-medium text-ink group-hover:text-accent-bright">
          {tool.title}
        </p>
        {tool.tagline && (
          <p className="mt-1 line-clamp-2 text-xs text-ink-mute">{tool.tagline}</p>
        )}
      </Link>
    </li>
  );
}
