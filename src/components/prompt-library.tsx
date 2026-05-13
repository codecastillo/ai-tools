'use client';
import { useState, useMemo } from 'react';
import { Copy, Check, ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';
import type { Prompt, PromptCategory } from '@/lib/prompts';
import { PROMPT_CATEGORY_LABEL } from '@/lib/prompts';

interface Props {
  prompts: Prompt[];
}

type Filter = PromptCategory | 'all';

export default function PromptLibrary({ prompts }: Props) {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const counts = useMemo(() => {
    const out: Record<string, number> = { all: prompts.length };
    for (const p of prompts) {
      out[p.category] = (out[p.category] ?? 0) + 1;
    }
    return out;
  }, [prompts]);

  const categories = useMemo(() => {
    const seen = new Set<PromptCategory>();
    for (const p of prompts) seen.add(p.category);
    return Array.from(seen);
  }, [prompts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return prompts.filter((p) => {
      if (filter !== 'all' && p.category !== filter) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.body.toLowerCase().includes(q)
      );
    });
  }, [prompts, filter, query]);

  function handleCopy(p: Prompt) {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    navigator.clipboard.writeText(p.body).then(() => {
      setCopied(p.slug);
      setTimeout(() => {
        setCopied((current) => (current === p.slug ? null : current));
      }, 1500);
    });
  }

  const pillBase = 'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors';
  const pillActive = 'bg-accent text-white';
  const pillInactive = 'bg-surface-2 text-ink-dim hover:bg-surface-3';

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`${pillBase} ${filter === 'all' ? pillActive : pillInactive}`}
        >
          All
          <span className={`text-[10px] ${filter === 'all' ? 'text-white/80' : 'text-ink-faint'}`}>
            {counts.all ?? 0}
          </span>
        </button>
        {categories.map((cat) => {
          const active = filter === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`${pillBase} ${active ? pillActive : pillInactive}`}
            >
              {PROMPT_CATEGORY_LABEL[cat]}
              <span className={`text-[10px] ${active ? 'text-white/80' : 'text-ink-faint'}`}>
                {counts[cat] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 mx-auto max-w-xl">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search prompts by title or content"
            className="w-full rounded-lg border border-line bg-surface-1 py-2.5 pl-10 pr-3 text-sm text-ink placeholder:text-ink-faint focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>
      </div>

      <div className="mt-3 text-center text-xs text-ink-faint">
        {filtered.length} {filtered.length === 1 ? 'prompt' : 'prompts'}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-xl border border-line bg-surface-1 p-10 text-center text-sm text-ink-dim">
          No prompts match those filters. Try clearing the search or selecting a different category.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((p) => (
            <article
              key={p.slug}
              className="rounded-xl border border-line bg-surface-1 p-5 flex flex-col"
            >
              <header className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-ink-faint">
                    {PROMPT_CATEGORY_LABEL[p.category]}
                  </div>
                  <h3 className="mt-1 text-base font-medium text-ink">{p.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(p)}
                  aria-label="Copy prompt"
                  className="rounded-md border border-line-2 bg-surface-2 p-2 hover:bg-surface-3"
                >
                  {copied === p.slug ? (
                    <Check className="h-3.5 w-3.5 text-success" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-ink-faint" />
                  )}
                </button>
              </header>
              <p className="mt-2 text-xs italic text-ink-faint">{p.why}</p>
              <pre className="mt-3 max-h-48 overflow-y-auto rounded-md bg-surface-2 p-3 text-[12px] font-mono leading-relaxed text-ink-dim whitespace-pre-wrap">
                {p.body}
              </pre>
              {p.best_tool && (
                <Link
                  href={`/tools/${p.best_tool}`}
                  className="mt-3 inline-flex items-center gap-1 text-xs text-accent hover:gap-2 transition-all"
                >
                  Best with this tool <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
