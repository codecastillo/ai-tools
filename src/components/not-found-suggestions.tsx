'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Search } from 'lucide-react';
import { findDuplicates } from '@/lib/duplicate';
import { cn } from '@/lib/cn';

interface Candidate {
  slug: string;
  title: string;
  url: string;
}

interface Match {
  slug: string;
  title: string;
  score: number;
}

interface Props {
  tools: Candidate[];
}

/**
 * Reads the failing URL path (last segment) and the user's typed query, then
 * runs `findDuplicates` from `lib/duplicate.ts` to surface the top fuzzy
 * matches. Both inputs are blended into a single search string so that
 * a typo like `/tools/cloud-code` still surfaces `Claude Code` even before
 * the user types anything.
 */
export default function NotFoundSuggestions({ tools }: Props) {
  const [pathHint, setPathHint] = useState('');
  const [query, setQuery] = useState('');

  // Pull the last meaningful path segment as the implicit query.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const path = window.location.pathname;
    const segments = path.split('/').filter(Boolean);
    const last = segments[segments.length - 1] ?? '';
    // De-slugify: "claude-code" → "claude code".
    const hint = decodeURIComponent(last).replace(/[-_]+/g, ' ').trim();
    setPathHint(hint);
  }, []);

  const matches: Match[] = useMemo(() => {
    if (tools.length === 0) return [];
    const term = (query.trim() || pathHint).trim();
    if (!term) return [];
    const { matches } = findDuplicates(
      { title: term, url: '' },
      tools,
    );
    return matches;
  }, [tools, pathHint, query]);

  return (
    <div className="space-y-3">
      <div className="group relative flex w-full items-center">
        <Search className="pointer-events-none absolute left-4 h-4 w-4 text-ink-faint transition-colors group-focus-within:text-accent-bright" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            pathHint ? `Search. Try "${pathHint}"…` : 'Search the catalog…'
          }
          aria-label="Search tools"
          autoFocus
          className="w-full rounded-xl border border-line-2 bg-surface-1 py-3 pl-11 pr-4 text-[15px] text-ink placeholder:text-ink-faint shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-all duration-200 focus:border-accent/80 focus:bg-surface-2 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:shadow-[0_0_24px_-12px_var(--color-accent-glow)]"
        />
      </div>

      {matches.length > 0 && (
        <div className="rounded-lg border border-accent/20 bg-accent/[0.04] px-4 py-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.10em] text-accent">
            Did you mean…
          </p>
          <ul className="mt-2 space-y-1.5">
            {matches.map((m) => (
              <li key={m.slug}>
                <Link
                  href={`/tools/${m.slug}`}
                  className={cn(
                    'group/match inline-flex items-center gap-1.5 text-sm text-ink underline decoration-accent/30 underline-offset-2 transition-colors',
                    'hover:decoration-accent',
                  )}
                >
                  {m.title}
                  <ArrowUpRight className="h-3 w-3 text-ink-faint transition-all group-hover/match:translate-x-0.5 group-hover/match:-translate-y-0.5 group-hover/match:text-accent-bright" />
                  <span className="ml-1 text-[11px] text-ink-faint">
                    ({Math.round(m.score * 100)}% match)
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {query && matches.length === 0 && tools.length > 0 && (
        <p className="text-sm text-ink-faint">No matches for &ldquo;{query}&rdquo;.</p>
      )}
    </div>
  );
}
