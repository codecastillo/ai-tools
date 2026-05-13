'use client';

import { useMemo, useState } from 'react';
import { Award, ExternalLink } from 'lucide-react';
import {
  type LLMRate,
  FAMILY_LABEL,
  type LLMFamily,
} from '@/lib/llm-rates';
import { cn } from '@/lib/cn';

interface Props {
  rates: LLMRate[];
}

type SortKey = 'input' | 'output' | 'context';

const FAMILY_COLOR: Record<LLMFamily, string> = {
  anthropic: '#FF6B5B',
  openai: '#10A37F',
  google: '#4285F4',
  meta: '#0668E1',
  mistral: '#FA552C',
  deepseek: '#7C3AED',
  alibaba: '#FF8B00',
  xai: '#FFFFFF',
};

function formatUsd(n: number): string {
  return `$${n.toLocaleString('en-US', {
    minimumFractionDigits: n < 1 ? 2 : 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatContext(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
  }
  if (n >= 1_000) {
    const k = n / 1_000;
    return `${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}K`;
  }
  return n.toLocaleString('en-US');
}

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'input', label: 'Cheapest input' },
  { key: 'output', label: 'Cheapest output' },
  { key: 'context', label: 'Largest context' },
];

export default function PricingTable({ rates }: Props) {
  const [sortBy, setSortBy] = useState<SortKey>('input');
  const [filterFamily, setFilterFamily] = useState<LLMFamily | 'all'>('all');

  const familyCounts = useMemo(() => {
    const counts: Record<string, number> = { all: rates.length };
    for (const r of rates) {
      counts[r.family] = (counts[r.family] ?? 0) + 1;
    }
    return counts;
  }, [rates]);

  const familyKeys = useMemo(
    () => Object.keys(FAMILY_LABEL) as LLMFamily[],
    [],
  );

  const filtered = useMemo(() => {
    let out = rates;
    if (filterFamily !== 'all') {
      out = out.filter((r) => r.family === filterFamily);
    }
    return [...out].sort((a, b) => {
      if (sortBy === 'context') return b.context_window - a.context_window;
      return a[sortBy] - b[sortBy];
    });
  }, [rates, sortBy, filterFamily]);

  const cheapestInputId = useMemo(() => {
    if (filtered.length === 0) return null;
    return filtered.reduce((min, r) => (r.input < min.input ? r : min))
      .id;
  }, [filtered]);

  const cheapestOutputId = useMemo(() => {
    if (filtered.length === 0) return null;
    return filtered.reduce((min, r) => (r.output < min.output ? r : min))
      .id;
  }, [filtered]);

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        {/* Family pills */}
        <div className="flex flex-wrap gap-2">
          <FilterPill
            active={filterFamily === 'all'}
            onClick={() => setFilterFamily('all')}
            label="All"
            count={familyCounts.all}
          />
          {familyKeys.map((fam) => {
            const count = familyCounts[fam] ?? 0;
            if (count === 0) return null;
            return (
              <FilterPill
                key={fam}
                active={filterFamily === fam}
                onClick={() => setFilterFamily(fam)}
                label={FAMILY_LABEL[fam]}
                count={count}
                dotColor={FAMILY_COLOR[fam]}
              />
            );
          })}
        </div>

        {/* Sort buttons */}
        <div className="flex flex-wrap gap-2">
          {SORT_OPTIONS.map((opt) => {
            const active = sortBy === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => setSortBy(opt.key)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs transition-colors',
                  active
                    ? 'bg-accent text-white'
                    : 'border border-white/[0.08] bg-white/[0.02] text-ink-dim hover:border-white/[0.18] hover:text-ink',
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop header */}
      <div className="mt-6 hidden lg:grid grid-cols-[1.1fr_1.4fr_0.8fr_0.9fr_0.9fr_0.8fr_1.6fr] gap-2 px-4 pb-2 text-[11px] uppercase tracking-wider text-ink-faint">
        <div>Vendor</div>
        <div>Model</div>
        <div className="text-right">Input ($/M)</div>
        <div className="text-right">Cached input</div>
        <div className="text-right">Output ($/M)</div>
        <div className="text-right">Context</div>
        <div>Notes</div>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-2 lg:gap-0">
        {filtered.map((r) => {
          const isCheapestInput = r.id === cheapestInputId;
          const isCheapestOutput = r.id === cheapestOutputId;
          return (
            <div
              key={r.id}
              className="group rounded-md border border-white/[0.06] bg-white/[0.02] py-3 px-4 transition-colors hover:bg-white/[0.04] lg:grid lg:grid-cols-[1.1fr_1.4fr_0.8fr_0.9fr_0.9fr_0.8fr_1.6fr] lg:gap-2 lg:items-center lg:border-transparent lg:bg-transparent lg:rounded-md"
            >
              {/* Vendor */}
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: FAMILY_COLOR[r.family] }}
                  aria-hidden
                />
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-ink hover:text-accent"
                >
                  {r.vendor}
                  <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-60" />
                </a>
              </div>

              {/* Model + mobile labels for the rest */}
              <div className="mt-1 lg:mt-0">
                <div className="text-sm font-medium text-ink">{r.model}</div>
                <div className="mt-1 flex flex-wrap items-center gap-2 lg:hidden">
                  {isCheapestInput && <CheapestBadge label="Cheapest input" />}
                  {isCheapestOutput && (
                    <CheapestBadge label="Cheapest output" />
                  )}
                </div>
              </div>

              {/* Mobile data grid */}
              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm lg:hidden">
                <MobileCell label="Input ($/M)" value={formatUsd(r.input)} />
                <MobileCell
                  label="Cached input"
                  value={
                    r.cached_input != null ? formatUsd(r.cached_input) : 'n/a'
                  }
                  muted={r.cached_input == null}
                />
                <MobileCell
                  label="Output ($/M)"
                  value={formatUsd(r.output)}
                />
                <MobileCell
                  label="Context"
                  value={formatContext(r.context_window)}
                />
              </div>

              {/* Desktop columns */}
              <div className="hidden lg:flex flex-col items-end">
                <span className="font-mono text-sm text-ink">
                  {formatUsd(r.input)}
                </span>
                {isCheapestInput && (
                  <span className="mt-0.5">
                    <CheapestBadge label="Cheapest input" />
                  </span>
                )}
              </div>
              <div className="hidden lg:block text-right">
                <span
                  className={cn(
                    'font-mono text-sm',
                    r.cached_input != null ? 'text-ink-dim' : 'text-ink-faint',
                  )}
                >
                  {r.cached_input != null
                    ? formatUsd(r.cached_input)
                    : 'n/a'}
                </span>
              </div>
              <div className="hidden lg:flex flex-col items-end">
                <span className="font-mono text-sm text-ink">
                  {formatUsd(r.output)}
                </span>
                {isCheapestOutput && (
                  <span className="mt-0.5">
                    <CheapestBadge label="Cheapest output" />
                  </span>
                )}
              </div>
              <div className="hidden lg:block text-right">
                <span className="font-mono text-sm text-ink-dim">
                  {formatContext(r.context_window)}
                </span>
              </div>

              {/* Notes */}
              <div className="mt-3 text-xs text-ink-dim lg:mt-0 lg:text-sm">
                {r.notes}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-md border border-white/[0.06] bg-white/[0.02] p-6 text-center text-sm text-ink-faint">
            No models match this filter.
          </div>
        )}
      </div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  label,
  count,
  dotColor,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  dotColor?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs transition-colors',
        active
          ? 'bg-accent text-white'
          : 'border border-white/[0.08] bg-white/[0.02] text-ink-dim hover:border-white/[0.18] hover:text-ink',
      )}
    >
      {dotColor && (
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ backgroundColor: dotColor }}
          aria-hidden
        />
      )}
      <span className="font-medium">{label}</span>
      <span
        className={cn(
          'text-[10px]',
          active ? 'opacity-80' : 'text-ink-faint',
        )}
      >
        {count}
      </span>
    </button>
  );
}

function CheapestBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-amber-400/30 bg-amber-400/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-300">
      <Award className="h-3 w-3 text-amber-400" />
      {label}
    </span>
  );
}

function MobileCell({
  label,
  value,
  muted = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-ink-faint">
        {label}
      </div>
      <div
        className={cn(
          'mt-0.5 font-mono text-sm',
          muted ? 'text-ink-faint' : 'text-ink',
        )}
      >
        {value}
      </div>
    </div>
  );
}
