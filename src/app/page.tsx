import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  DollarSign,
  GraduationCap,
  Layers,
  Library,
  Newspaper,
  Sparkles,
} from 'lucide-react';
import { listApprovedTools, listCuratedStacks } from '@/lib/db';
import { CATEGORIES, type Category } from '@/lib/types';
import { pickToolOfTheDay } from '@/lib/tool-of-the-day';
import { groupByCategory } from '@/lib/sections';
import { CHANGELOG, relativeTime } from '@/lib/changelog';
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
import ToolFinderQuiz from '@/components/tool-finder-quiz';
import TrendingStrip from '@/components/trending-strip';
import SiteStatsBand from '@/components/site-stats-band';
import AiNewsTicker from '@/components/ai-news-ticker';
import NewsletterSignup from '@/components/newsletter-signup';
import DailyTipCard from '@/components/daily-tip-card';
import TypingCycle from '@/components/typing-cycle';
import AuroraBackground from '@/components/aurora-background';
import SectionReveal from '@/components/section-reveal';

export const dynamic = 'force-dynamic';

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
  const recentChangelog = CHANGELOG.slice(0, 3);

  const fourteenDaysMs = 14 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const newThisWeek = !isFiltering
    ? allTools.tools.filter((t) => {
        if (!t.created_at) return false;
        const createdAt = new Date(t.created_at).getTime();
        if (Number.isNaN(createdAt)) return false;
        return now - createdAt <= fourteenDaysMs;
      })
    : [];

  return (
    <div className="relative mx-auto max-w-screen-2xl px-6 pb-24 pt-10 sm:pt-14 lg:px-12">
      {/* HERO */}
      <section className="relative motion-safe:section-in">
        <AuroraBackground />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-dot-grid opacity-50"
        />

        <div className="flex flex-col items-center text-center">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-ink-faint">
            A reference for AI dev tooling
          </p>

          <h1 className="text-display mt-5 text-balance text-5xl text-ink sm:text-6xl lg:text-7xl">
            <TypingCycle
              phrases={[
                'Find your favorite AI tools.',
                'Compare them.',
                'Save them for later.',
                'Try a new stack today.',
              ]}
            />
          </h1>

          <SectionReveal>
            <p className="mt-5 max-w-xl text-balance text-base text-ink-dim sm:text-lg">
              We hand-pick AI tools real devs love. Install guides, usage tips,
              curated stacks, all in one place.
            </p>
          </SectionReveal>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="#sections"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-bg shadow-[0_0_24px_-8px_var(--color-accent-glow)] transition-all duration-150 hover:-translate-y-px hover:bg-accent-bright"
            >
              Browse all tools
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-line-2 bg-surface-1 px-5 py-2 text-sm font-medium text-ink-dim transition-all duration-150 hover:-translate-y-px hover:border-accent/40 hover:text-ink"
            >
              <Sparkles className="h-4 w-4" aria-hidden />
              Submit a tool
            </Link>
          </div>

          <div className="mt-10 w-full max-w-3xl">
            <TerminalHero tools={allTools.tools} />
          </div>
        </div>

        {/* Small inline stat trio under the hero */}
        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          <StatCard
            icon={<Library className="h-4 w-4" aria-hidden />}
            value={counts.all}
            label="Tools indexed"
            sublabel="curated guides"
          />
          <StatCard
            icon={<Layers className="h-4 w-4" aria-hidden />}
            value={stacks.length}
            label="Stacks"
            sublabel="ready-to-share starter kits"
          />
          <StatCard
            icon={<Sparkles className="h-4 w-4" aria-hidden />}
            value={4}
            label="Categories"
            sublabel="claude, clis, frameworks, productivity"
          />
        </div>
      </section>

      {/* TOOL FINDER QUIZ */}
      <section id="find-your-tool" className="mt-16 md:mt-20 motion-safe:section-in">
        <ToolFinderQuiz tools={allTools.tools} />
      </section>

      {/* PICK YOUR PATH */}
      <section className="mt-16 md:mt-20 motion-safe:section-in">
        <div className="text-center">
          <h2 className="text-display text-2xl text-ink">Pick your path</h2>
          <p className="mt-2 text-sm text-ink-dim">
            Quick-start entry points if you&apos;re not sure where to begin.
          </p>
        </div>
        <div className="mt-6">
          <PathCards />
        </div>
      </section>

      {/* TOOL MARQUEE */}
      <section
        aria-label="Tools we track"
        className="mt-16 md:mt-20 motion-safe:section-in"
      >
        <div className="mb-4 text-center">
          <h2 className="text-display text-2xl text-ink">
            Tools we track{' '}
            <span className="font-mono text-base text-ink-faint">
              ({counts.all})
            </span>
          </h2>
        </div>
        <ToolMarquee tools={allTools.tools} />
      </section>

      {/* SEARCH */}
      <section className="mt-16 md:mt-20 flex flex-col items-center text-center">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-ink-faint">
          Or jump straight in
        </p>
        <div className="mt-3 w-full max-w-2xl">
          <SearchBar placeholder={`Search ${counts.all} tools…`} />
        </div>
      </section>

      {/* Recently viewed (renders only when localStorage data exists) */}
      {!isFiltering && <RecentlyViewed />}

      {/* FILTERED VIEW */}
      {isFiltering ? (
        <>
          <section className="mt-12">
            <CategoryTabs selected={category ?? null} counts={counts} q={q} />
          </section>
          <section className="mt-6">
            {filtered.tools.length === 0 ? (
              <p className="rounded-xl border border-dashed border-line-2 bg-surface-1 py-16 text-center text-sm text-ink-mute">
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
          {/* TOOL OF THE DAY */}
          {featuredOfDay && (
            <div className="mt-16 md:mt-20">
              <ToolOfTheDay tool={featuredOfDay} />
            </div>
          )}

          {/* TRENDING THIS WEEK */}
          <section className="mt-16 md:mt-20 motion-safe:section-in">
            <TrendingStrip tools={allTools.tools} />
          </section>

          {/* DAILY TIP */}
          <section className="mt-16 md:mt-20 motion-safe:section-in">
            <DailyTipCard />
          </section>

          {/* NEW THIS WEEK */}
          <section
            aria-label="New this week"
            className="mt-16 md:mt-20 motion-safe:section-in"
          >
            <div className="mb-6 text-center">
              <h2 className="text-display text-2xl text-ink">New this week</h2>
              <p className="mt-2 text-sm text-ink-dim">
                Tools added in the last 14 days.
              </p>
            </div>
            {newThisWeek.length === 0 ? (
              <p className="text-center text-sm text-ink-faint">
                No new tools this week.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {newThisWeek.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            )}
          </section>

          {/* WHAT'S NEW */}
          <section
            aria-label="What's new"
            className="mt-16 md:mt-20 motion-safe:section-in"
          >
            <div className="mb-6 text-center">
              <h2 className="text-display text-2xl text-ink">What&apos;s new</h2>
              <p className="mt-2 text-sm text-ink-dim">
                Two recent additions worth knowing about.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="group flex flex-col items-center rounded-2xl border border-line bg-surface-1 p-8 text-center md:p-10">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line-2 bg-surface-2 text-accent">
                  <DollarSign className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-display text-xl text-ink">
                  LLM pricing in one place
                </h3>
                <p className="mt-2 max-w-md text-sm text-ink-dim">
                  Per-million-token rates for every frontier model side by side.
                  Calculate spend before you ship.
                </p>
                <Link
                  href="/pricing"
                  className="mt-5 inline-flex items-center gap-1 text-sm text-accent transition-all group-hover:gap-2"
                >
                  Compare rates
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </div>

              <div className="group flex flex-col items-center rounded-2xl border border-line bg-surface-1 p-8 text-center md:p-10">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line-2 bg-surface-2 text-accent">
                  <GraduationCap className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-display text-xl text-ink">
                  Where to start
                </h3>
                <p className="mt-2 max-w-md text-sm text-ink-dim">
                  Guided learning paths from your first chat completion through
                  shipping a production agent.
                </p>
                <Link
                  href="/learn"
                  className="mt-5 inline-flex items-center gap-1 text-sm text-accent transition-all group-hover:gap-2"
                >
                  See paths
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </div>
            </div>
          </section>

          {/* CURATED STACKS */}
          {stacks.length > 0 && (
            <section className="mt-16 md:mt-20 motion-safe:section-in">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <Layers className="h-5 w-5 text-accent-bright" aria-hidden />
                    <h2 className="text-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                      Stacks
                    </h2>
                  </div>
                  <p className="mt-2 max-w-xl text-sm text-ink-dim sm:text-base">
                    Hand-picked combinations for common workflows. Start here
                    when you don&apos;t know where to begin.
                  </p>
                  <span
                    aria-hidden
                    className="mt-3 block h-[2px] w-20 rounded-full bg-accent"
                  />
                </div>
                <Link
                  href="/stacks"
                  className="inline-flex items-center gap-1.5 self-start rounded-md border border-line-2 bg-surface-1 px-3 py-1.5 text-sm font-medium text-ink-mute transition-all duration-150 hover:-translate-y-px hover:border-accent/40 hover:bg-accent/[0.06] hover:text-accent-bright sm:self-end"
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
                    className="group lift-on-hover flex h-full flex-col items-center rounded-2xl border border-l border-line-2 bg-surface-1 p-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] transition-all hover:border-accent/30 hover:bg-accent/[0.04]"
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
                    <div className="mt-5 flex w-full items-center justify-between border-t border-line pt-3 font-mono text-[11px] text-ink-faint transition-colors group-hover:border-line-2">
                      <span>{s.tool_ids.length} tools</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-accent-bright" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* CATEGORY SECTIONS */}
          <div
            id="sections"
            className="mt-16 md:mt-20 space-y-20 scroll-mt-20"
          >
            {sections.map((section) => (
              <CategorySection key={section.category} section={section} />
            ))}
          </div>

          {/* GLOSSARY TEASER */}
          <section
            aria-label="Glossary"
            className="mt-16 md:mt-20 motion-safe:section-in"
          >
            <div className="group flex flex-col items-center rounded-2xl border border-line bg-surface-1 p-8 text-center md:p-10">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line-2 bg-surface-2 text-accent">
                <BookOpen className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="mt-4 text-display text-2xl text-ink">
                Speak the language
              </h2>
              <p className="mt-2 max-w-xl text-sm text-ink-dim">
                30+ terms decoded, from RAG to MCP. Hover any term in a guide to
                see the definition inline.
              </p>
              <Link
                href="/glossary"
                className="mt-5 inline-flex items-center gap-1 text-sm text-accent transition-all group-hover:gap-2"
              >
                Open the glossary
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          </section>

          {/* STUDY MODE TEASER */}
          <section
            aria-label="Study features"
            className="mt-16 md:mt-20 motion-safe:section-in"
          >
            <div className="mb-6 flex flex-col items-center gap-2 text-center">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line-2 bg-surface-2 text-accent">
                <GraduationCap className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="mt-2 text-display text-2xl text-ink">Study mode</h2>
              <p className="text-ink-mute max-w-xl">
                Built for school. Flashcards, quizzes, notes, a pomodoro, and a tracker, all kept in your browser.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <Link href="/flashcards" className="group rounded-xl border border-line bg-surface-1 p-5 text-center hover:border-line-2 hover:bg-surface-2 transition">
                <Layers className="h-5 w-5 text-accent mx-auto" />
                <div className="mt-2 text-sm font-medium text-ink">Flashcards</div>
                <div className="mt-1 text-xs text-ink-mute">60 glossary terms</div>
              </Link>
              <Link href="/quiz" className="group rounded-xl border border-line bg-surface-1 p-5 text-center hover:border-line-2 hover:bg-surface-2 transition">
                <Sparkles className="h-5 w-5 text-accent mx-auto" />
                <div className="mt-2 text-sm font-medium text-ink">Quiz</div>
                <div className="mt-1 text-xs text-ink-mute">Test yourself</div>
              </Link>
              <Link href="/notes" className="group rounded-xl border border-line bg-surface-1 p-5 text-center hover:border-line-2 hover:bg-surface-2 transition">
                <BookOpen className="h-5 w-5 text-accent mx-auto" />
                <div className="mt-2 text-sm font-medium text-ink">Notes</div>
                <div className="mt-1 text-xs text-ink-mute">Per-tool study notes</div>
              </Link>
              <Link href="/study" className="group rounded-xl border border-line bg-surface-1 p-5 text-center hover:border-line-2 hover:bg-surface-2 transition">
                <GraduationCap className="h-5 w-5 text-accent mx-auto" />
                <div className="mt-2 text-sm font-medium text-ink">Study mode</div>
                <div className="mt-1 text-xs text-ink-mute">Pomodoro + paths</div>
              </Link>
              <Link href="/tracker" className="group rounded-xl border border-line bg-surface-1 p-5 text-center hover:border-line-2 hover:bg-surface-2 transition">
                <Library className="h-5 w-5 text-accent mx-auto" />
                <div className="mt-2 text-sm font-medium text-ink">Tracker</div>
                <div className="mt-1 text-xs text-ink-mute">Tried · Want · Using</div>
              </Link>
            </div>
          </section>

          {/* AI ECOSYSTEM NEWS */}
          <section
            aria-label="AI ecosystem news"
            className="mt-16 md:mt-20 motion-safe:section-in"
          >
            <AiNewsTicker />
          </section>

          {/* CHANGELOG TEASER */}
          <section
            aria-label="Latest from the site"
            className="mt-16 md:mt-20 motion-safe:section-in"
          >
            <div className="mb-6 flex flex-col items-center gap-2 text-center">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line-2 bg-surface-2 text-accent">
                <Newspaper className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="mt-2 text-display text-2xl text-ink">
                Latest from the site
              </h2>
              <p className="text-sm text-ink-dim">
                Recent shipped changes, in plain English.
              </p>
            </div>
            <ul className="grid gap-4 md:grid-cols-3">
              {recentChangelog.map((entry) => (
                <li key={entry.date}>
                  <Link
                    href="/changelog"
                    className="group flex h-full flex-col items-center rounded-2xl border border-line bg-surface-1 p-6 text-center transition-all hover:border-accent/30 hover:bg-accent/[0.04]"
                  >
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
                      {relativeTime(entry.date)}
                    </span>
                    <span className="mt-1 font-mono text-[10px] text-ink-faint">
                      {entry.date}
                    </span>
                    <h3 className="mt-3 text-base font-semibold text-ink">
                      {entry.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm text-ink-dim">
                      {entry.body}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs text-accent transition-all group-hover:gap-2">
                      Read more
                      <ArrowRight className="h-3 w-3" aria-hidden />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 text-center">
              <Link
                href="/changelog"
                className="inline-flex items-center gap-1 text-sm text-accent transition-all hover:gap-2"
              >
                See full changelog
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          </section>

          {/* NEWSLETTER SIGNUP */}
          <section className="mt-16 md:mt-20">
            <NewsletterSignup />
          </section>

          {/* RECENTLY ADDED */}
          {recentlyAdded.length > 0 && (
            <section
              className="mt-16 md:mt-20 motion-safe:section-in text-center"
              aria-label="Recently added"
            >
              <div className="flex items-center justify-center gap-2">
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full bg-accent-2"
                />
                <span className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-ink-faint">
                  Recently added
                </span>
              </div>
              <ul className="mt-3 flex flex-wrap justify-center gap-2">
                {recentlyAdded.map((t) => (
                  <li key={t.id}>
                    <Link
                      href={`/tools/${t.slug}`}
                      className="inline-flex items-center gap-2 rounded-full border border-line-2 bg-surface-1 px-3 py-1 text-xs text-ink-dim transition-all hover:-translate-y-px hover:border-accent/40 hover:bg-accent/10 hover:text-accent-bright"
                    >
                      <span className="font-medium text-ink">{t.title}</span>
                      {t.tagline && (
                        <span className="hidden text-ink-faint sm:inline">
                          · {truncate(t.tagline, 48)}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* SITE STATS BAND (footer) */}
          <div className="mt-16 md:mt-20 -mx-6 lg:-mx-12">
            <SiteStatsBand
              toolCount={allTools.total}
              stackCount={stacks.length}
              categoryCount={4}
            />
          </div>
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
