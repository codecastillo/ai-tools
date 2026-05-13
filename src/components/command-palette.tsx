'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import {
  ArrowRight,
  Box,
  GitCompare,
  Home,
  Layers,
  Plus,
  Search,
  Shield,
  Wrench,
} from 'lucide-react';
import { useCommandPalette } from './command-palette-provider';
import type { Tool } from '@/lib/types';

interface NavEntry {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  keywords?: string[];
}

const NAV_ENTRIES: NavEntry[] = [
  { label: 'Home', href: '/', icon: Home, keywords: ['index', 'start'] },
  { label: 'Submit a tool', href: '/submit', icon: Plus, keywords: ['add', 'new'] },
  { label: 'Browse stacks', href: '/stacks', icon: Layers, keywords: ['stack', 'curated'] },
  { label: 'Compare tools', href: '/compare', icon: GitCompare, keywords: ['vs', 'diff'] },
  { label: 'Admin', href: '/admin', icon: Shield, keywords: ['queue', 'review'] },
];

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

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global command palette"
      overlayClassName="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out"
      contentClassName="fixed left-1/2 top-[18%] z-50 w-[92vw] max-w-xl -translate-x-1/2 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0f0f10] shadow-2xl ring-1 ring-black/40"
    >
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-3.5 py-3">
        <Search className="h-4 w-4 text-ink-faint" aria-hidden="true" />
        <Command.Input
          value={search}
          onValueChange={setSearch}
          placeholder="Search tools, jump to pages…"
          className="w-full bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
        />
        <kbd className="hidden rounded border border-white/[0.10] bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-faint sm:inline-block">
          Esc
        </kbd>
      </div>
      <Command.List className="max-h-[60vh] overflow-y-auto p-1.5">
        <Command.Empty className="px-3 py-8 text-center text-sm text-ink-faint">
          {loading ? 'Loading…' : 'No results.'}
        </Command.Empty>

        {tools.length > 0 && (
          <Command.Group
            heading="Tools"
            className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-ink-faint"
          >
            {tools.map((t) => (
              <Command.Item
                key={t.id}
                value={`tool ${t.title} ${t.slug} ${t.tags.join(' ')}`}
                keywords={[t.title, t.slug, ...t.tags]}
                onSelect={() => go(`/tools/${t.slug}`)}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-sm text-ink-dim aria-selected:bg-white/[0.06] aria-selected:text-ink data-[selected=true]:bg-white/[0.06] data-[selected=true]:text-ink"
              >
                <Wrench className="h-3.5 w-3.5 shrink-0 text-ink-faint" aria-hidden="true" />
                <span className="truncate font-medium">{t.title}</span>
                {t.tagline && (
                  <span className="ml-1 truncate text-xs text-ink-faint">
                    — {t.tagline}
                  </span>
                )}
                <ArrowRight className="ml-auto h-3.5 w-3.5 shrink-0 text-ink-faint opacity-0 transition-opacity data-[selected=true]:opacity-100" />
              </Command.Item>
            ))}
          </Command.Group>
        )}

        <Command.Group
          heading="Navigate"
          className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-ink-faint"
        >
          {NAV_ENTRIES.map((n) => {
            const Icon = n.icon;
            return (
              <Command.Item
                key={n.href}
                value={`nav ${n.label} ${n.keywords?.join(' ') ?? ''}`}
                keywords={[n.label, ...(n.keywords ?? [])]}
                onSelect={() => go(n.href)}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-sm text-ink-dim aria-selected:bg-white/[0.06] aria-selected:text-ink data-[selected=true]:bg-white/[0.06] data-[selected=true]:text-ink"
              >
                <Icon className="h-3.5 w-3.5 shrink-0 text-ink-faint" aria-hidden="true" />
                <span>{n.label}</span>
                <span className="ml-auto font-mono text-[10px] text-ink-faint">{n.href}</span>
              </Command.Item>
            );
          })}
        </Command.Group>

        {tools.length === 0 && !loading && (
          <div className="flex items-center gap-2 px-3 py-3 text-xs text-ink-faint">
            <Box className="h-3.5 w-3.5" aria-hidden="true" />
            Tool list unavailable.
          </div>
        )}
      </Command.List>
      <div className="flex items-center justify-between gap-2 border-t border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[10px] text-ink-faint">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <kbd className="rounded border border-white/[0.10] bg-white/[0.03] px-1 py-0.5 font-mono">↵</kbd>
            select
          </span>
          <span className="inline-flex items-center gap-1">
            <kbd className="rounded border border-white/[0.10] bg-white/[0.03] px-1 py-0.5 font-mono">↑↓</kbd>
            navigate
          </span>
        </div>
        <span className="font-mono uppercase tracking-wider">ai.tools</span>
      </div>
    </Command.Dialog>
  );
}
