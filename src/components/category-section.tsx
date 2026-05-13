import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Category, Tool } from '@/lib/types';
import { categoryStyle } from '@/lib/categories';
import { cn } from '@/lib/cn';
import ToolCard from '@/components/tool-card';

export interface CategorySectionProps {
  section: {
    category: Category;
    label: string;
    short: string;
    subtitle: string;
    tools: Tool[];
  };
}

const SECTION_CAP = 6;

export default function CategorySection({ section }: CategorySectionProps) {
  const cat = categoryStyle(section.category);
  const tools = section.tools.slice(0, SECTION_CAP);
  const total = section.tools.length;
  const hasMore = total > SECTION_CAP;

  return (
    <section
      id={`cat-${section.category}`}
      className="motion-safe:section-in scroll-mt-20"
      aria-labelledby={`cat-${section.category}-title`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className={cn('h-3 w-3 rounded-full shadow-[0_0_18px_-2px_currentColor]', cat.dotClass)}
            />
            <h2
              id={`cat-${section.category}-title`}
              className="text-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl"
            >
              {section.short}
            </h2>
            <span className="font-mono text-[11px] text-ink-faint">
              {total} {total === 1 ? 'tool' : 'tools'}
            </span>
          </div>
          <p className="mt-2 max-w-xl text-sm text-ink-dim sm:text-base">
            {section.subtitle}
          </p>
          {/* Colored underline strip */}
          <span
            aria-hidden
            className={cn('mt-3 block h-[2px] w-20 rounded-full', cat.dotClass)}
          />
        </div>

        <Link
          href={`/?category=${section.category}`}
          className={cn(
            'inline-flex items-center gap-1.5 self-start rounded-md border px-3 py-1.5 text-sm font-medium transition-all duration-150 sm:self-end',
            'border-white/[0.08] bg-white/[0.02] text-ink-mute hover:-translate-y-px hover:border-accent/40 hover:bg-accent/[0.06] hover:text-accent-bright',
          )}
        >
          {hasMore ? `View all ${total}` : 'View all'}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <ToolCard key={t.id} tool={t} />
        ))}
      </div>
    </section>
  );
}
