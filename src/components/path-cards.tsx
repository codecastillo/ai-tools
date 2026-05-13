import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PATHS } from '@/lib/paths';
import { categoryStyle } from '@/lib/categories';

/**
 * "Pick your path" trio of quick-start entry tiles, shown right under the
 * hero. Each card routes to a pre-filtered view of the catalog.
 */
export default function PathCards() {
  return (
    <section
      aria-label="Quick-start paths"
      className="grid gap-4 sm:grid-cols-3"
    >
      {PATHS.map((p) => {
        const cat = categoryStyle(p.category ?? null);
        return (
          <Link
            key={p.slug}
            href={p.href}
            className="group relative flex h-full flex-col rounded-2xl border-[1.5px] border-white/[0.08] bg-[--color-surface] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_0_40px_-12px_var(--color-accent-glow)]"
          >
            <span className="text-3xl leading-none" aria-hidden>
              {p.emoji}
            </span>
            <h3 className="mt-3 text-xl font-semibold text-ink">{p.title}</h3>
            <p className="mt-2 text-sm text-ink-dim line-clamp-3">
              {p.description}
            </p>
            <span className="mt-auto pt-4 inline-flex items-center gap-1 text-sm font-medium text-accent transition-transform group-hover:translate-x-0.5">
              Open path
              <ArrowRight className="h-4 w-4" />
            </span>
            {/* tiny corner dot in category color */}
            <span
              aria-hidden
              className={`absolute top-4 right-4 h-2 w-2 rounded-full ${cat.dotClass}`}
            />
          </Link>
        );
      })}
    </section>
  );
}
