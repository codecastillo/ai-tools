'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bookmark, Trash2, ArrowRight } from 'lucide-react';
import type { Tool } from '@/lib/types';
import ToolCard from '@/components/tool-card';
import { cn } from '@/lib/cn';

const STORAGE_KEY = 'aitools_saved';
const EVENT_NAME = 'aitools_saved_change';

function readSaved(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((s): s is string => typeof s === 'string');
  } catch {
    return [];
  }
}

function clearSaved() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: [] }));
  } catch {
    // ignore
  }
}

export default function SavedToolsClient() {
  const [mounted, setMounted] = useState(false);
  const [slugs, setSlugs] = useState<string[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setSlugs(readSaved());

    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<string[]>).detail;
      setSlugs(Array.isArray(detail) ? detail : readSaved());
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setSlugs(readSaved());
    };

    window.addEventListener(EVENT_NAME, onChange as EventListener);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(EVENT_NAME, onChange as EventListener);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch('/api/tools')
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load tools');
        const data = (await res.json()) as { tools: Tool[] };
        if (cancelled) return;
        setTools(Array.isArray(data.tools) ? data.tools : []);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : 'Failed to load tools');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="min-h-[200px]" aria-hidden />
    );
  }

  const handleClearAll = () => {
    if (typeof window === 'undefined') return;
    const ok = window.confirm('Clear all saved tools? This cannot be undone.');
    if (!ok) return;
    clearSaved();
    setSlugs([]);
  };

  if (slugs.length === 0) {
    return <EmptyState />;
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-line bg-surface-1 p-10 text-center text-sm text-ink-mute">
        Loading your saved tools.
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-line bg-surface-1 p-10 text-center text-sm text-ink-mute">
        Could not load tools. {error}
      </div>
    );
  }

  const savedSet = new Set(slugs);
  const savedTools = tools.filter((t) => savedSet.has(t.slug));
  const missingCount = slugs.length - savedTools.length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-mute">
          {savedTools.length} {savedTools.length === 1 ? 'tool' : 'tools'} saved
          {missingCount > 0 && (
            <span className="ml-2 text-ink-faint">
              ({missingCount} unavailable)
            </span>
          )}
        </p>
        <button
          type="button"
          onClick={handleClearAll}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md border border-line-2 bg-surface-1 px-3 py-1.5 text-xs font-medium text-ink-mute transition-colors',
            'hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40',
          )}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear all
        </button>
      </div>

      {savedTools.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-line bg-surface-1 p-10 text-center text-sm text-ink-mute">
          The tools you saved are no longer available.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {savedTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-line bg-surface-1 p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-line-2 bg-surface-2">
        <Bookmark className="h-5 w-5 text-ink-faint" />
      </div>
      <p className="mt-4 text-base text-ink">You haven&apos;t saved any tools yet.</p>
      <p className="mt-1 text-sm text-ink-mute">
        Tap the star on any tool to save it here.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-bright"
      >
        Browse tools
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
