'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Box,
  FileText,
  Globe,
  Layers,
  Search,
  Wrench,
  Zap,
} from 'lucide-react';
import { useCommandPalette } from './command-palette-provider';
import type { Tool } from '@/lib/types';
import { GLOSSARY } from '@/lib/glossary';
import { PROMPTS, PROMPT_CATEGORY_LABEL } from '@/lib/prompts';
import { RECIPES } from '@/lib/recipes';
import { BENCHMARKS } from '@/lib/benchmarks';

interface PageEntry {
  label: string;
  href: string;
  keywords?: string[];
}

const PAGES: PageEntry[] = [
  { label: 'Home', href: '/', keywords: ['index', 'start', 'landing'] },
  { label: 'Stacks', href: '/stacks', keywords: ['stack', 'curated', 'bundles'] },
  { label: 'Compare', href: '/compare', keywords: ['vs', 'diff', 'comparison'] },
  { label: 'Pricing', href: '/pricing', keywords: ['cost', 'price', 'plans'] },
  { label: 'Learn', href: '/learn', keywords: ['guides', 'tutorials', 'docs'] },
  { label: 'Glossary', href: '/glossary', keywords: ['terms', 'dictionary', 'definitions'] },
  { label: 'Changelog', href: '/changelog', keywords: ['updates', 'releases', 'history'] },
  { label: 'Submit', href: '/submit', keywords: ['add', 'new', 'contribute'] },
  { label: 'Prompts', href: '/prompts', keywords: ['library', 'templates'] },
  { label: 'Recipes', href: '/recipes', keywords: ['stacks', 'cookbook', 'setups'] },
  { label: 'Benchmarks', href: '/benchmarks', keywords: ['scores', 'leaderboard', 'models'] },
];

interface ActionEntry {
  label: string;
  hint?: string;
  keywords?: string[];
  run: (router: ReturnType<typeof useRouter>) => void;
}

const ACTIONS: ActionEntry[] = [
  {
    label: 'Open new stack',
    hint: '/stack/builder',
    keywords: ['create', 'builder', 'new', 'stack'],
    run: (router) => router.push('/stack/builder'),
  },
  {
    label: 'Theme: toggle',
    hint: 'dark / light',
    keywords: ['theme', 'dark', 'light', 'appearance', 'mode'],
    // Read the current attribute set by ThemeProvider's bootstrap script,
    // flip it, and persist. Mirrors the logic in `theme-provider.tsx`.
    run: () => {
      if (typeof document === 'undefined') return;
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      try {
        localStorage.setItem('aitools_theme', next);
      } catch {
        /* private mode */
      }
    },
  },
];

const GROUP_CLS =
  '[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-ink-faint';

const ITEM_CLS =
  'flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-sm text-ink-dim aria-selected:bg-surface-3 aria-selected:text-ink data-[selected=true]:bg-surface-3 data-[selected=true]:text-ink';

export default function CommandPalette() {
  const { open, setOpen } = useCommandPalette();
  const router = useRouter();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const fetchedRef = useRef(false);

  // Lazy-fetch the tool list when the palette is first opened.
  useEffect(() => {
    if (!open || fetchedRef.current) return;
    fetchedRef.current = true;
    setLoading(true);
    fetch('/api/tools')
      .then((r) => (r.ok ? r.json() : { tools: [] }))
      .then((data: { tools?: Tool[] }) => {
        setTools(Array.isArray(data?.tools) ? data.tools : []);
      })
      .catch(() => setTools([]))
      .finally(() => setLoading(false));
  }, [open]);

  // Reset search when closed.
  useEffect(() => {
    if (!open) setSearch('');
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const runAction = (action: ActionEntry) => {
    setOpen(false);
    action.run(router);
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global command palette"
      overlayClassName="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out"
      contentClassName="fixed left-1/2 top-[14%] z-50 w-[92vw] max-w-xl -translate-x-1/2 overflow-hidden rounded-xl border border-line-2 bg-[#0f0f10] shadow-2xl ring-1 ring-black/40"
    >
      <div className="flex items-center gap-2 border-b border-line-2 px-3.5 py-3">
        <Search className="h-4 w-4 text-ink-faint" aria-hidden="true" />
        <Command.Input
          value={search}
          onValueChange={setSearch}
          placeholder="Search tools, terms, prompts, recipes, models, pages..."
          className="w-full bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
        />
        <kbd className="hidden rounded border border-line-2 bg-surface-1 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-faint sm:inline-block">
          Esc
        </kbd>
      </div>
      <Command.List className="max-h-[62vh] overflow-y-auto p-1.5">
        <Command.Empty className="px-3 py-8 text-center text-sm text-ink-faint">
          {loading ? 'Loading...' : 'No results.'}
        </Command.Empty>

        {tools.length > 0 && (
          <Command.Group heading="Tools" className={GROUP_CLS}>
            {tools.map((t) => (
              <Command.Item
                key={`tool-${t.id}`}
                value={`tool ${t.title} ${t.slug} ${t.tags.join(' ')} ${t.tagline ?? ''}`}
                keywords={[t.title, t.slug, ...t.tags, ...(t.tagline ? [t.tagline] : [])]}
                onSelect={() => go(`/tools/${t.slug}`)}
                className={ITEM_CLS}
              >
                <Wrench className="h-3.5 w-3.5 shrink-0 text-ink-faint" aria-hidden="true" />
                <span className="truncate font-medium">{t.title}</span>
                {t.tagline && (
                  <span className="ml-1 truncate text-xs text-ink-faint">
                    {'·'} {t.tagline}
                  </span>
                )}
                <ArrowRight className="ml-auto h-3.5 w-3.5 shrink-0 text-ink-faint opacity-0 transition-opacity data-[selected=true]:opacity-100" />
              </Command.Item>
            ))}
          </Command.Group>
        )}

        <Command.Group heading="Glossary" className={GROUP_CLS}>
          {GLOSSARY.map((g) => (
            <Command.Item
              key={`glossary-${g.slug}-${g.term}`}
              value={`glossary ${g.term} ${g.slug} ${g.short}`}
              keywords={[g.term, g.slug, g.short, ...(g.related ?? [])]}
              onSelect={() => go(`/glossary#term-${g.slug}`)}
              className={ITEM_CLS}
            >
              <BookOpen className="h-3.5 w-3.5 shrink-0 text-ink-faint" aria-hidden="true" />
              <span className="truncate font-medium">{g.term}</span>
              <span className="ml-1 truncate text-xs text-ink-faint">
                {'·'} {g.short}
              </span>
              <ArrowRight className="ml-auto h-3.5 w-3.5 shrink-0 text-ink-faint opacity-0 transition-opacity data-[selected=true]:opacity-100" />
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading="Prompts" className={GROUP_CLS}>
          {PROMPTS.map((p) => (
            <Command.Item
              key={`prompt-${p.slug}`}
              value={`prompt ${p.title} ${p.slug} ${p.category} ${p.why}`}
              keywords={[p.title, p.slug, p.category, PROMPT_CATEGORY_LABEL[p.category], p.why]}
              onSelect={() => go('/prompts')}
              className={ITEM_CLS}
            >
              <FileText className="h-3.5 w-3.5 shrink-0 text-ink-faint" aria-hidden="true" />
              <span className="truncate font-medium">{p.title}</span>
              <span className="ml-1 truncate text-xs text-ink-faint">
                {'·'} {PROMPT_CATEGORY_LABEL[p.category]}
              </span>
              <ArrowRight className="ml-auto h-3.5 w-3.5 shrink-0 text-ink-faint opacity-0 transition-opacity data-[selected=true]:opacity-100" />
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading="Recipes" className={GROUP_CLS}>
          {RECIPES.map((r) => (
            <Command.Item
              key={`recipe-${r.slug}`}
              value={`recipe ${r.title} ${r.slug} ${r.tagline} ${r.tools.join(' ')} ${r.difficulty}`}
              keywords={[r.title, r.slug, r.tagline, r.difficulty, ...r.tools]}
              onSelect={() => go('/recipes')}
              className={ITEM_CLS}
            >
              <Layers className="h-3.5 w-3.5 shrink-0 text-ink-faint" aria-hidden="true" />
              <span className="truncate font-medium">{r.title}</span>
              <span className="ml-1 truncate text-xs text-ink-faint">
                {'·'} {r.tagline}
              </span>
              <ArrowRight className="ml-auto h-3.5 w-3.5 shrink-0 text-ink-faint opacity-0 transition-opacity data-[selected=true]:opacity-100" />
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading="Benchmarks" className={GROUP_CLS}>
          {BENCHMARKS.map((b) => (
            <Command.Item
              key={`bench-${b.model_id}`}
              value={`benchmark ${b.model} ${b.model_id} ${b.vendor} ${b.notes}`}
              keywords={[b.model, b.model_id, b.vendor, b.notes, b.release]}
              onSelect={() => go('/benchmarks')}
              className={ITEM_CLS}
            >
              <BarChart3 className="h-3.5 w-3.5 shrink-0 text-ink-faint" aria-hidden="true" />
              <span className="truncate font-medium">{b.model}</span>
              <span className="ml-1 truncate text-xs text-ink-faint">
                {'·'} {b.vendor}
              </span>
              <ArrowRight className="ml-auto h-3.5 w-3.5 shrink-0 text-ink-faint opacity-0 transition-opacity data-[selected=true]:opacity-100" />
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading="Pages" className={GROUP_CLS}>
          {PAGES.map((p) => (
            <Command.Item
              key={`page-${p.href}`}
              value={`page ${p.label} ${p.href} ${p.keywords?.join(' ') ?? ''}`}
              keywords={[p.label, p.href, ...(p.keywords ?? [])]}
              onSelect={() => go(p.href)}
              className={ITEM_CLS}
            >
              <Globe className="h-3.5 w-3.5 shrink-0 text-ink-faint" aria-hidden="true" />
              <span>{p.label}</span>
              <span className="ml-auto font-mono text-[10px] text-ink-faint">{p.href}</span>
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading="Actions" className={GROUP_CLS}>
          {ACTIONS.map((a) => (
            <Command.Item
              key={`action-${a.label}`}
              value={`action ${a.label} ${a.keywords?.join(' ') ?? ''}`}
              keywords={[a.label, ...(a.keywords ?? [])]}
              onSelect={() => runAction(a)}
              className={ITEM_CLS}
            >
              <Zap className="h-3.5 w-3.5 shrink-0 text-ink-faint" aria-hidden="true" />
              <span>{a.label}</span>
              {a.hint && (
                <span className="ml-auto font-mono text-[10px] text-ink-faint">{a.hint}</span>
              )}
            </Command.Item>
          ))}
        </Command.Group>

        {tools.length === 0 && !loading && (
          <div className="flex items-center gap-2 px-3 py-3 text-xs text-ink-faint">
            <Box className="h-3.5 w-3.5" aria-hidden="true" />
            Tool list unavailable.
          </div>
        )}
      </Command.List>
      <div className="flex items-center justify-between gap-2 border-t border-line-2 bg-surface-1 px-3 py-2 text-[10px] text-ink-faint">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <kbd className="rounded border border-line-2 bg-surface-1 px-1 py-0.5 font-mono">{'↵'}</kbd>
            select
          </span>
          <span className="inline-flex items-center gap-1">
            <kbd className="rounded border border-line-2 bg-surface-1 px-1 py-0.5 font-mono">{'↑↓'}</kbd>
            navigate
          </span>
        </div>
        <span className="font-mono uppercase tracking-wider">ai.tools</span>
      </div>
    </Command.Dialog>
  );
}
