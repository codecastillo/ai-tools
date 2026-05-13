import Link from 'next/link';
import { ArrowRight, Layers, Library, Sparkles } from 'lucide-react';
import { listApprovedTools, listCuratedStacks } from '@/lib/db';
import { CATEGORIES, type Category } from '@/lib/types';
import { pickToolOfTheDay } from '@/lib/tool-of-the-day';
import { groupByCategory } from '@/lib/sections';
import TerminalHero from '@/components/terminal-hero';
import ToolOfTheDay from '@/components/tool-of-the-day';
import CategorySection from '@/components/category-section';
import StatCard from '@/components/stat-card';
import PathCards from '@/components/path-cards';
import ToolMarquee from '@/components/tool-marquee';
import RecentlyViewed from '@/components/recently-viewed';
import SearchBar from '@/components/search-bar';
import CategoryTabs from '@/components/category-tabs';
import ToolCard from '@/components/tool-card';

interface HomeProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

export default async function HomePage({ searchParams }: HomeProps) {
  const params = await searchParams;
  const q = params.q?.trim() || undefined;
  const category = isValidCategory(params.category) ? params.category : undefined;
  const isFiltering = Boolean(q) || Boolean(category);

  const [allTools, filteredResult, stacks] = await Promise.all([
    listApprovedTools({ limit: 100 }),
    isFiltering ? listApprovedTools({ q, category, limit: 100 }) : null,
    listCuratedStacks(),
  ]);
  const filtered = filteredResult ?? { tools: [], total: 0 };

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

  const sections = groupByCategory(allTools.tools);
  const featuredOfDay = !isFiltering ? pickToolOfTheDay(allTools.tools) : null;
  const recentlyAdded = !isFiltering ? allTools.tools.slice(0, 5) : [];

  return (
    <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-10 sm:pt-14">
      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative motion-safe:section-in">
        {/* Dotted-grid backdrop, only behind the hero. */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-dot-grid opacity-50"
        />

        <div className="grid gap-10 lg:grid-cols-[3fr_2fr] lg:items-center lg:gap-12">
          <div className="min-w-0">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-ink-faint">
              A reference for AI dev tooling
            </p>

            <h1 className="text-display mt-5 text-balance text-5xl text-ink sm:text-6xl lg:text-7xl">
              Find your favorite AI tools.
            </h1>

            <p className="mt-5 max-w-xl text-balance text-base text-ink-dim sm:text-lg">
              We hand-pick AI tools real devs love — install guides, usage tips,
              curated stacks, all in one place.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="#sections"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-bg shadow-[0_0_24px_-8px_var(--color-accent-glow)] transition-all duration-150 hover:-translate-y-px hover:bg-accent-bright"
              >
                Browse all tools
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/submit"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white/[0.10] bg-white/[0.02] px-5 py-2 text-sm font-medium text-ink-dim transition-all duration-150 hover:-translate-y-px hover:border-accent/40 hover:text-ink"
              >
                <Sparkles className="h-4 w-4" aria-hidden />
                Submit a tool
              </Link>
            </div>
          </div>

          <div className="min-w-0">
            <TerminalHero tools={allTools.tools} />
          </div>
        </div>

        {/* Stat cards */}
        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          <StatCard
            icon={<Library className="h-4 w-4" aria-hidden />}
            value={counts.all}
            label="tools"
            sublabel="curated guides"
          />
          <StatCard
            icon={<Layers className="h-4 w-4" aria-hidden />}
            value={4}
            label="categories"
            sublabel="claude, clis, frameworks, productivity"
          />
          <StatCard
            icon={<Sparkles className="h-4 w-4" aria-hidden />}
            value={stacks.length}
            label="stacks"
            sublabel="ready-to-share starter kits"
          />
        </div>
      </section>

      {/* ─── PICK YOUR PATH ───────────────────────────────────────────────── */}
      <section className="mt-16 motion-safe:section-in">
        <h2 className="text-display text-2xl text-ink">Pick your path</h2>
        <p className="mt-2 text-sm text-ink-dim">
          Quick-start entry points if you&apos;re not sure where to begin.
        </p>
        <div className="mt-6">
          <PathCards />
        </div>
      </section>

      {/* ─── TOOL-NAME MARQUEE ────────────────────────────────────────────── */}
      <section aria-label="All tools" className="mt-12 motion-safe:section-in">
        <ToolMarquee tools={allTools.tools} />
      </section>

      {/* ─── SEARCH ───────────────────────────────────────────────────────── */}
      <section className="mt-14 flex flex-col items-center text-center">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-ink-faint">
          Or jump straight in
        </p>
        <div className="mt-3 w-full max-w-2xl">
          <SearchBar placeholder={`Search ${counts.all} tools…`} />
        </div>
      </section>

      {/* Recently viewed (hides itself when localStorage is empty) */}
      {!isFiltering && <RecentlyViewed />}

      {/* ─── FILTERED VIEW (search or category) ───────────────────────────── */}
      {isFiltering ? (
        <>
          <section className="mt-12">
            <CategoryTabs selected={category ?? null} counts={counts} q={q} />
          </section>
          <section className="mt-6">
            {filtered.tools.length === 0 ? (
              <p className="rounded-xl border border-dashed border-white/[0.08] bg-white/[0.01] py-16 text-center text-sm text-ink-mute">
                {q ? `No tools match "${q}".` : 'No tools in this category yet.'}
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.tools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            )}
          </section>
        </>
      ) : (
        <>
          {/* ─── TOOL OF THE DAY ───────────────────────────────────────── */}
          {featuredOfDay && (
            <div className="mt-16">
              <ToolOfTheDay tool={featuredOfDay} />
            </div>
          )}

          {/* ─── CURATED STACKS ────────────────────────────────────────── */}
          {stacks.length > 0 && (
            <section className="mt-16 motion-safe:section-in">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <Layers className="h-5 w-5 text-accent-bright" aria-hidden />
                    <h2 className="text-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                      Curated stacks
                    </h2>
                  </div>
                  <p className="mt-2 max-w-xl text-sm text-ink-dim sm:text-base">
                    Hand-picked combinations for common workflows — start here when
                    you don&apos;t know where to start.
                  </p>
                  <span aria-hidden className="mt-3 block h-[2px] w-20 rounded-full bg-accent" />
                </div>
                <Link
                  href="/stacks"
                  className="inline-flex items-center gap-1.5 self-start rounded-md border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-sm font-medium text-ink-mute transition-all duration-150 hover:-translate-y-px hover:border-accent/40 hover:bg-accent/[0.06] hover:text-accent-bright sm:self-end"
                >
                  Browse all
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {stacks.slice(0, 3).map((s) => (
                  <Link
                    key={s.id}
                    href={`/stacks/${s.slug}`}
                    className="group lift-on-hover flex h-full flex-col rounded-2xl border-2 border-l-2 border-white/[0.08] border-l-accent/50 bg-white/[0.02] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] transition-all hover:border-accent/30 hover:border-l-accent hover:bg-accent/[0.04]"
                  >
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-accent-bright">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent transition-transform duration-200 group-hover:scale-150" />
                      Stack
                    </span>
                    <h3 className="mt-3 text-lg font-semibold tracking-tight text-ink">
                      {s.name ?? s.slug}
                    </h3>
                    {s.description && (
                      <p className="mt-1.5 text-sm text-ink-dim line-clamp-2">
                        {s.description}
                      </p>
                    )}
                    <div className="flex-1" />
                    <div className="mt-5 flex items-center justify-between border-t border-white/[0.05] pt-3 font-mono text-[11px] text-ink-faint transition-colors group-hover:border-white/[0.10]">
                      <span>{s.tool_ids.length} tools</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-accent-bright" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ─── CATEGORY SECTIONS ─────────────────────────────────────── */}
          <div id="sections" className="mt-20 space-y-20 scroll-mt-20">
            {sections.map((section) => (
              <CategorySection key={section.category} section={section} />
            ))}
          </div>

          {/* ─── RECENTLY ADDED ────────────────────────────────────────── */}
          {recentlyAdded.length > 0 && (
            <section className="mt-20 motion-safe:section-in" aria-label="Recently added">
              <div className="flex items-center gap-2">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent-2" />
                <span className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-ink-faint">
                  Recently added
                </span>
              </div>
              <ul className="mt-3 flex flex-wrap gap-2">
                {recentlyAdded.map((t) => (
                  <li key={t.id}>
                    <Link
                      href={`/tools/${t.slug}`}
                      className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-xs text-ink-dim transition-all hover:-translate-y-px hover:border-accent/40 hover:bg-accent/10 hover:text-accent-bright"
                    >
                      <span className="font-medium text-ink">{t.title}</span>
                      {t.tagline && (
                        <span className="hidden text-ink-faint sm:inline">
                          — {truncate(t.tagline, 48)}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  return `${s.slice(0, n - 1).trimEnd()}…`;
}

function isValidCategory(c: unknown): c is Category {
  return typeof c === 'string' && (CATEGORIES as readonly string[]).includes(c);
}
