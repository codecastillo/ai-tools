'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowDown,
  ArrowUp,
  Plus,
  Search,
  Share2,
  Trash2,
  X,
} from 'lucide-react';
import type { Tool } from '@/lib/types';
import { categoryStyle } from '@/lib/categories';
import {
  addToDraft,
  clearDraft,
  getDraft,
  onDraftChange,
  removeFromDraft,
  reorderDraft,
} from '@/lib/draft-stack';
import { cn } from '@/lib/cn';
import { celebrate } from '@/lib/confetti';
import { shareStack } from './actions';

interface Props {
  catalog: Tool[];
}

export default function StackBuilderClient({ catalog }: Props) {
  const router = useRouter();
  const [draftIds, setDraftIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setMounted(true);
    setDraftIds(getDraft());
    const unsub = onDraftChange((ids) => setDraftIds(ids));
    return unsub;
  }, []);

  const byId = useMemo(() => {
    const m = new Map<string, Tool>();
    for (const t of catalog) m.set(t.id, t);
    return m;
  }, [catalog]);

  const draftTools = useMemo(
    () => draftIds.map((id) => byId.get(id)).filter((t): t is Tool => Boolean(t)),
    [draftIds, byId],
  );

  const filteredCatalog = useMemo(() => {
    const q = query.trim().toLowerCase();
    const inDraft = new Set(draftIds);
    const base = catalog.filter((t) => !inDraft.has(t.id));
    if (!q) return base;
    return base.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.tagline ?? '').toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q)),
    );
  }, [catalog, query, draftIds]);

  const canShare = draftTools.length >= 1 && !isPending;

  const onShare = () => {
    if (!canShare) return;
    setError(null);
    startTransition(async () => {
      const result = await shareStack({
        tool_ids: draftIds,
        name: name.trim() || undefined,
        description: description.trim() || undefined,
      });
      if (result.error || !result.slug) {
        setError(result.error ?? 'Something went wrong.');
        return;
      }
      const slug = result.slug;
      void celebrate();
      clearDraft();
      router.push(`/stacks/${slug}`);
    });
  };

  // Avoid hydration mismatch — draft is client-only.
  if (!mounted) {
    return (
      <div className="mt-8 text-sm text-ink-mute">Loading your draft…</div>
    );
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_minmax(0,360px)]">
      {/* Left column: draft list + meta inputs */}
      <section>
        <div className="rounded-xl border border-white/[0.06] bg-[--color-surface] p-5">
          <div className="grid gap-4">
            <label className="block">
              <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-faint">
                Stack name (optional)
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={120}
                placeholder="My AI dev stack"
                className="mt-1.5 w-full rounded-md border border-white/[0.08] bg-[--color-surface-hover] px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </label>
            <label className="block">
              <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-faint">
                Description (optional)
              </span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                maxLength={2000}
                placeholder="What's the workflow this stack supports?"
                className="mt-1.5 w-full resize-none rounded-md border border-white/[0.08] bg-[--color-surface-hover] px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </label>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-medium uppercase tracking-[0.12em] text-ink-faint">
              Your draft · {draftTools.length} {draftTools.length === 1 ? 'tool' : 'tools'}
            </h2>
            {draftTools.length > 0 && (
              <button
                type="button"
                onClick={() => clearDraft()}
                className="inline-flex items-center gap-1 text-xs text-ink-mute transition-colors hover:text-ink-dim"
              >
                <Trash2 className="h-3 w-3" />
                Clear
              </button>
            )}
          </div>

          {draftTools.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-white/[0.08] bg-[--color-surface]/40 px-5 py-10 text-center">
              <p className="text-sm text-ink-dim">
                Your draft is empty. Browse tools and click the{' '}
                <span className="inline-flex items-center align-middle">
                  <Plus className="inline h-3.5 w-3.5" />
                </span>{' '}
                button to add them, or pick from the catalog on the right.
              </p>
            </div>
          ) : (
            <ol className="mt-4 space-y-2">
              {draftTools.map((tool, i) => {
                const cat = categoryStyle(tool.category);
                const first = tool.title.charAt(0).toUpperCase();
                return (
                  <li
                    key={tool.id}
                    className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-[--color-surface] px-4 py-3"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-white/[0.06] bg-white/[0.03] font-mono text-base font-medium text-ink-dim">
                      {first}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium text-ink">
                          {tool.title}
                        </span>
                        <span className={cn('h-1.5 w-1.5 rounded-full', cat.dotClass)} />
                        <span className={cn('text-[10px] uppercase tracking-wider', cat.textClass)}>
                          {cat.short}
                        </span>
                      </div>
                      {tool.tagline && (
                        <p className="mt-0.5 truncate text-xs text-ink-mute">{tool.tagline}</p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        aria-label="Move up"
                        title="Move up"
                        disabled={i === 0}
                        onClick={() => reorderDraft(i, i - 1)}
                        className="grid h-7 w-7 place-items-center rounded-md border border-white/[0.06] text-ink-faint transition-colors hover:border-white/[0.14] hover:text-ink-dim disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label="Move down"
                        title="Move down"
                        disabled={i === draftTools.length - 1}
                        onClick={() => reorderDraft(i, i + 1)}
                        className="grid h-7 w-7 place-items-center rounded-md border border-white/[0.06] text-ink-faint transition-colors hover:border-white/[0.14] hover:text-ink-dim disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Remove ${tool.title}`}
                        title="Remove"
                        onClick={() => removeFromDraft(tool.id)}
                        className="grid h-7 w-7 place-items-center rounded-md border border-white/[0.06] text-ink-faint transition-colors hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-300"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-md border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300"
          >
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onShare}
            disabled={!canShare}
            className={cn(
              'inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-all',
              canShare
                ? 'border-accent/40 bg-accent/15 text-accent-bright hover:border-accent/60 hover:bg-accent/25'
                : 'cursor-not-allowed border-white/[0.06] bg-white/[0.02] text-ink-faint',
            )}
          >
            <Share2 className="h-4 w-4" />
            {isPending ? 'Sharing…' : 'Share stack'}
          </button>
          <p className="text-xs text-ink-mute">
            Sharing creates a public URL with the tools in this order.
          </p>
        </div>
      </section>

      {/* Right column: catalog picker */}
      <aside>
        <div className="rounded-xl border border-white/[0.06] bg-[--color-surface] p-5">
          <h2 className="text-sm font-medium uppercase tracking-[0.12em] text-ink-faint">
            Add tools
          </h2>
          <div className="relative mt-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-faint" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the catalog"
              className="w-full rounded-md border border-white/[0.08] bg-[--color-surface-hover] py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>

          <div className="mt-3 max-h-[28rem] space-y-1.5 overflow-y-auto pr-1">
            {filteredCatalog.length === 0 ? (
              <p className="px-2 py-4 text-center text-xs text-ink-mute">
                {query.trim()
                  ? 'No matching tools.'
                  : 'Every tool is already in your draft.'}
              </p>
            ) : (
              filteredCatalog.map((tool) => {
                const cat = categoryStyle(tool.category);
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => addToDraft(tool.id)}
                    className="group flex w-full items-center gap-2.5 rounded-md border border-transparent px-2.5 py-2 text-left transition-all hover:border-white/[0.08] hover:bg-[--color-surface-hover]"
                  >
                    <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', cat.dotClass)} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-ink">{tool.title}</span>
                      {tool.tagline && (
                        <span className="block truncate text-[11px] text-ink-mute">
                          {tool.tagline}
                        </span>
                      )}
                    </span>
                    <Plus className="h-3.5 w-3.5 shrink-0 text-ink-faint transition-colors group-hover:text-accent" />
                  </button>
                );
              })
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
