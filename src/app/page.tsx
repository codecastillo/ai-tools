import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { listApprovedTools, listCuratedStacks } from '@/lib/db';
import { CATEGORIES, type Category } from '@/lib/types';
import ToolCard from '@/components/tool-card';
import SearchBar from '@/components/search-bar';
import CategoryTabs from '@/components/category-tabs';
import RecentlyViewed from '@/components/recently-viewed';

interface HomeProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

export default async function HomePage({ searchParams }: HomeProps) {
  const params = await searchParams;
  const q = params.q?.trim() || undefined;
  const category = isValidCategory(params.category) ? params.category : undefined;

  const [allTools, filtered, stacks] = await Promise.all([
    listApprovedTools({ limit: 100 }),
    listApprovedTools({ q, category, limit: 100 }),
    listCuratedStacks(),
  ]);

  const counts: Record<'all' | Category, number> = {
    all: allTools.total,
    claude: 0,
    clis: 0,
    frameworks: 0,
    productivity: 0,
  };
  for (const t of allTools.tools) {
    if (t.category && t.category in counts) counts[t.category]++;
  }

  const featured =
    !q && !category
      ? filtered.tools.find((t) => t.slug === 'claude-code') ??
        filtered.tools.find((t) => t.is_curated) ??
        null
      : null;

  const rest = featured
    ? filtered.tools.filter((t) => t.id !== featured.id)
    : filtered.tools;

  return (
    <div className="mx-auto max-w-6xl px-6 pb-20 pt-12 sm:pt-16">
      {/* Hero */}
      <section className="relative">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-faint">
          A reference for AI dev tooling
        </p>
        <h1 className="mt-4 text-balance text-4xl font-medium tracking-tight text-ink sm:text-5xl md:text-6xl">
          Install, use, master the AI toolchain.
        </h1>
        <p className="mt-5 max-w-2xl text-balance text-lg text-ink-dim">
          Hand-picked guides for the tools real developers ship with — from Claude Code to Cursor to
          the Vercel AI SDK. Browse, compare, and build your own stack.
        </p>

        <div className="mt-8">
          <SearchBar placeholder={`Search ${counts.all} tools…`} />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-ink-mute">
          <Stat label="tools" value={counts.all} />
          <Dot />
          <Stat label="categories" value={4} />
          <Dot />
          <Stat label="curated stacks" value={stacks.length} />
        </div>
      </section>

      {/* Recently viewed (hides itself when localStorage is empty) */}
      {!q && !category && <RecentlyViewed />}

      {/* Curated stacks rail */}
      {stacks.length > 0 && !q && !category && (
        <section className="mt-14">
          <div className="flex items-baseline justify-between">
            <div>
              <h2 className="text-sm font-medium text-ink">Curated stacks</h2>
              <p className="mt-1 text-sm text-ink-faint">
                Hand-picked combinations for common workflows.
              </p>
            </div>
            <Link
              href="/stacks"
              className="inline-flex items-center gap-1 text-sm text-ink-mute transition-colors hover:text-accent"
            >
              Browse all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stacks.slice(0, 3).map((s) => (
              <Link
                key={s.id}
                href={`/stacks/${s.slug}`}
                className="group lift-on-hover flex h-full flex-col rounded-xl border border-l-2 border-white/[0.06] border-l-accent/40 bg-white/[0.02] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] transition-all hover:border-accent/30 hover:border-l-accent hover:bg-accent/[0.04]"
              >
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.10em] text-accent">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent transition-transform duration-200 group-hover:scale-150" />
                  Stack
                </span>
                <h3 className="mt-2 text-base font-medium text-ink">{s.name ?? s.slug}</h3>
                {s.description && (
                  <p className="mt-1 text-sm text-ink-dim line-clamp-2">{s.description}</p>
                )}
                <div className="mt-4 flex items-center justify-between text-[11px] text-ink-faint">
                  <span>{s.tool_ids.length} tools</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-accent-bright" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Tabs */}
      <section className="mt-12">
        <CategoryTabs selected={category ?? null} counts={counts} q={q} />
      </section>

      {/* Featured */}
      {featured && (
        <section className="relative mt-6">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-8 -inset-y-6 -z-10 gradient-featured-wash blur-2xl"
          />
          <div className="gradient-featured rounded-2xl p-px">
            <ToolCard tool={featured} variant="featured" />
          </div>
        </section>
      )}

      {/* Grid */}
      <section className="mt-4">
        {rest.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/[0.08] bg-white/[0.01] py-16 text-center text-sm text-ink-mute">
            {q ? `No tools match "${q}".` : 'No tools in this category yet.'}
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <span>
      <span className="font-medium text-ink">{value}</span>{' '}
      <span className="text-ink-faint">{label}</span>
    </span>
  );
}

function Dot() {
  return (
    <span
      aria-hidden
      className="inline-block h-1 w-1 rounded-full bg-accent/60"
    />
  );
}

function isValidCategory(c: unknown): c is Category {
  return typeof c === 'string' && (CATEGORIES as readonly string[]).includes(c);
}
