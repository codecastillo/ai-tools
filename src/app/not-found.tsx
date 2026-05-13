import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Search } from 'lucide-react';
import { listApprovedTools } from '@/lib/db';
import NotFoundSuggestions from '@/components/not-found-suggestions';

export const dynamic = 'force-dynamic';

export default async function NotFound() {
  let tools: { slug: string; title: string; url: string }[] = [];
  let popular: { slug: string; title: string }[] = [];
  try {
    const res = await listApprovedTools({ limit: 100 });
    tools = res.tools.map((t) => ({ slug: t.slug, title: t.title, url: t.url }));
    popular = res.tools
      .filter((t) => t.is_curated || t.slug === 'claude-code')
      .slice(0, 5)
      .map((t) => ({ slug: t.slug, title: t.title }));
    // Fallback: just show first few if nothing curated.
    if (popular.length === 0) {
      popular = res.tools.slice(0, 5).map((t) => ({ slug: t.slug, title: t.title }));
    }
  } catch {
    // DB unavailable (e.g. during build with empty DATABASE_URL). Fall back to
    // a generic 404. `tools` stays empty, the client island will just show
    // a search field with no suggestions.
  }

  return (
    <div className="relative mx-auto flex max-w-xl flex-col px-6 pb-20 pt-20 sm:pt-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 gradient-featured-wash blur-2xl"
      />

      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-faint">
        404 · Let&apos;s get you back on track
      </p>
      <h1 className="mt-4 text-balance text-4xl font-medium tracking-tight text-ink sm:text-5xl">
        We couldn&apos;t find that page.
      </h1>
      <p className="mt-3 text-balance text-base text-ink-dim">
        But here are some tools we love. Or use the search.
      </p>

      <div className="mt-8">
        <NotFoundSuggestions tools={tools} />
      </div>

      {popular.length > 0 && (
        <div className="mt-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.10em] text-ink-faint">
            Popular tools
          </p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {popular.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/tools/${t.slug}`}
                  className="group flex items-center justify-between rounded-md border border-line-2 bg-surface-1 px-3 py-2 text-sm text-ink-dim shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] transition-all hover:-translate-y-px hover:border-accent/30 hover:bg-accent/[0.04] hover:text-ink"
                >
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent transition-transform group-hover:scale-150" />
                    {t.title}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-ink-faint transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-bright" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-12 flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-1.5 rounded-md border border-line-2 bg-surface-1 px-4 py-2 text-sm text-ink-dim transition-all hover:-translate-y-px hover:border-accent/40 hover:bg-accent/[0.04] hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back home
        </Link>
        <Link
          href="/submit"
          className="inline-flex items-center justify-center gap-1.5 rounded-md border border-transparent px-4 py-2 text-sm text-ink-mute transition-colors hover:text-accent-bright"
        >
          <Search className="h-3.5 w-3.5" />
          Submit a tool
        </Link>
      </div>
    </div>
  );
}
