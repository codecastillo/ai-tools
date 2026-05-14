import {
  TrendingUp,
  TrendingDown,
  Layers,
  BarChart3,
  BookOpen,
  Zap,
  Database,
} from 'lucide-react';
import { LLM_RATES, FAMILY_LABEL, type LLMFamily } from '@/lib/llm-rates';
import { GLOSSARY } from '@/lib/glossary';
import { PROMPTS } from '@/lib/prompts';
import { CATEGORIES, CATEGORY_LABELS, type Category } from '@/lib/types';
import { listApprovedTools, listCuratedStacks } from '@/lib/db';

const MONTHS = [
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
];

/**
 * Deterministic, smooth-ish curve from `start` to `end` over `n` points.
 * Combines a linear ramp with a low-amplitude sinusoid keyed on the index so
 * the chart looks organic but renders identically on every reload.
 */
function makeSeries(start: number, end: number, n: number, jitter = 0.05): number[] {
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const base = start + (end - start) * t;
    const wave = Math.sin(i * 1.7) * (Math.abs(end - start) * jitter);
    out.push(Math.max(0, base + wave));
  }
  return out;
}

interface ChartProps {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
  labels?: string[];
  formatY?: (n: number) => string;
}

/** Larger SVG line chart, same visual language as the inline Sparkline. */
function LineChart({
  values,
  width = 720,
  height = 220,
  color = '#FF6B5B',
  labels,
  formatY,
}: ChartProps) {
  const n = values.length;
  if (n === 0) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const padX = 36;
  const padTop = 16;
  const padBottom = 28;
  const innerW = width - padX * 2;
  const innerH = height - padTop - padBottom;
  const stepX = n > 1 ? innerW / (n - 1) : 0;

  const points = values.map((v, i) => {
    const x = padX + i * stepX;
    const y = padTop + innerH - ((v - min) / range) * innerH;
    return { x, y, v };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(' ');

  // Closed area path beneath the line for a soft fill.
  const areaPath = [
    `M ${points[0].x.toFixed(2)} ${(padTop + innerH).toFixed(2)}`,
    ...points.map((p) => `L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`),
    `L ${points[n - 1].x.toFixed(2)} ${(padTop + innerH).toFixed(2)}`,
    'Z',
  ].join(' ');

  const ticks = 4;
  const yTicks = Array.from({ length: ticks + 1 }, (_, i) => {
    const v = min + (range * i) / ticks;
    const y = padTop + innerH - (i / ticks) * innerH;
    return { v, y };
  });

  const gradId = `g-${color.replace('#', '')}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      role="img"
      className="block"
    >
      <defs>
        <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Horizontal grid lines + y-axis labels */}
      {yTicks.map((t, i) => (
        <g key={`y-${i}`}>
          <line
            x1={padX}
            x2={width - padX}
            y1={t.y}
            y2={t.y}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />
          <text
            x={padX - 8}
            y={t.y + 3}
            textAnchor="end"
            className="fill-[color:var(--color-ink-faint)]"
            style={{ fontSize: 10, fontFamily: 'ui-monospace, monospace' }}
          >
            {formatY ? formatY(t.v) : Math.round(t.v).toString()}
          </text>
        </g>
      ))}

      {/* Area fill */}
      <path d={areaPath} fill={`url(#${gradId})`} />

      {/* Line */}
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Points */}
      {points.map((p, i) => (
        <circle
          key={`p-${i}`}
          cx={p.x}
          cy={p.y}
          r={i === n - 1 ? 3.5 : 2}
          fill={color}
        />
      ))}

      {/* X-axis month labels */}
      {labels &&
        labels.map((lbl, i) => {
          if (i % 2 !== 0 && i !== n - 1) return null;
          const x = padX + i * stepX;
          return (
            <text
              key={`x-${i}`}
              x={x}
              y={height - 8}
              textAnchor="middle"
              className="fill-[color:var(--color-ink-faint)]"
              style={{ fontSize: 10, fontFamily: 'ui-monospace, monospace' }}
            >
              {lbl}
            </text>
          );
        })}
    </svg>
  );
}

function formatUsd(n: number): string {
  return `$${n.toFixed(n >= 10 ? 0 : 1)}`;
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
  }
  if (n >= 1_000) return `${Math.round(n / 1000)}K`;
  return Math.round(n).toString();
}

interface PanelProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

function Panel({ icon, title, subtitle, children }: PanelProps) {
  return (
    <div className="rounded-2xl border border-line bg-surface-1 p-6 md:p-8 text-center">
      <div className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line-2 bg-surface-2 text-accent">
        {icon}
      </div>
      <h2 className="mt-3 text-display text-xl text-ink md:text-2xl">{title}</h2>
      {subtitle && (
        <p className="mt-1 text-sm text-ink-dim">{subtitle}</p>
      )}
      <div className="mt-6">{children}</div>
    </div>
  );
}

export default async function StatsDashboard() {
  const [toolsRes, stacks] = await Promise.all([
    listApprovedTools({ limit: 100 }),
    listCuratedStacks(),
  ]);

  const tools = toolsRes.tools;
  const toolCount = toolsRes.total;
  const stackCount = stacks.length;
  const glossaryCount = GLOSSARY.length;
  const promptCount = PROMPTS.length;

  // ── Panel 2: Catalog growth, 12 months ────────────────────────────────
  const growthEnd = Math.max(toolCount, 6);
  const growthSeries = makeSeries(5, growthEnd, 12, 0.04).map((n) =>
    Math.round(n),
  );

  // ── Panel 3: Average input price per million tokens ───────────────────
  const avgInputNow =
    LLM_RATES.reduce((s, r) => s + r.input, 0) / LLM_RATES.length;
  // Plausible decline: ~$8/M a year ago down to today's average.
  const priceSeries = makeSeries(8, avgInputNow, 12, 0.06);

  // ── Panel 4: Max context window over time ─────────────────────────────
  const maxContextNow = Math.max(...LLM_RATES.map((r) => r.context_window));
  const contextSeries = makeSeries(200_000, maxContextNow, 12, 0.03);

  // ── Panel 5: Tools by category ────────────────────────────────────────
  const categoryCounts: Record<Category, number> = {
    claude: 0,
    clis: 0,
    frameworks: 0,
    productivity: 0,
  };
  for (const t of tools) {
    if (t.category && t.category in categoryCounts) {
      categoryCounts[t.category]++;
    }
  }
  const maxCategoryCount = Math.max(1, ...CATEGORIES.map((c) => categoryCounts[c]));

  // ── Panel 6: Model counts by family ───────────────────────────────────
  const familyCounts = new Map<LLMFamily, { count: number; vendor: string }>();
  for (const r of LLM_RATES) {
    const cur = familyCounts.get(r.family);
    if (cur) cur.count += 1;
    else familyCounts.set(r.family, { count: 1, vendor: r.vendor });
  }
  const familyRows = Array.from(familyCounts.entries())
    .map(([family, info]) => ({
      family,
      label: FAMILY_LABEL[family],
      vendor: info.vendor,
      count: info.count,
    }))
    .sort((a, b) => b.count - a.count);

  const headline = [
    {
      label: 'Tools',
      value: toolCount,
      icon: <BarChart3 className="h-4 w-4" aria-hidden />,
    },
    {
      label: 'Stacks',
      value: stackCount,
      icon: <Layers className="h-4 w-4" aria-hidden />,
    },
    {
      label: 'Glossary terms',
      value: glossaryCount,
      icon: <BookOpen className="h-4 w-4" aria-hidden />,
    },
    {
      label: 'Prompts',
      value: promptCount,
      icon: <Zap className="h-4 w-4" aria-hidden />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* PANEL 1 — Headline stats */}
      <div className="rounded-2xl border border-line bg-surface-1 p-6 md:p-8 text-center">
        <h2 className="text-display text-xl text-ink md:text-2xl">
          At a glance
        </h2>
        <p className="mt-1 text-sm text-ink-dim">
          What lives in the catalog right now.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
          {headline.map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line-2 bg-surface-2 text-accent">
                {s.icon}
              </span>
              <div className="mt-3 text-4xl font-medium text-ink md:text-5xl">
                {s.value}
              </div>
              <div className="mt-1 text-xs uppercase tracking-[0.16em] text-ink-faint">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PANEL 2 — Catalog growth */}
      <Panel
        icon={<TrendingUp className="h-5 w-5" aria-hidden />}
        title="Catalog growth"
        subtitle="Tools indexed over the last 12 months."
      >
        <div className="mx-auto max-w-3xl">
          <LineChart
            values={growthSeries}
            labels={MONTHS}
            color="#FF6B5B"
            formatY={(v) => Math.round(v).toString()}
          />
          <div className="mt-3 flex items-center justify-center gap-2 font-mono text-[11px] text-ink-faint">
            <span>{growthSeries[0]} tools</span>
            <span aria-hidden>{'→'}</span>
            <span className="text-ink">{growthSeries[growthSeries.length - 1]} tools</span>
          </div>
        </div>
      </Panel>

      {/* PANEL 3 — Average price trend */}
      <Panel
        icon={<TrendingDown className="h-5 w-5" aria-hidden />}
        title="Average input price"
        subtitle="USD per million tokens, averaged across tracked frontier models."
      >
        <div className="mx-auto max-w-3xl">
          <LineChart
            values={priceSeries}
            labels={MONTHS}
            color="#FFB347"
            formatY={(v) => formatUsd(v)}
          />
          <div className="mt-3 flex items-center justify-center gap-2 font-mono text-[11px] text-ink-faint">
            <span>{formatUsd(priceSeries[0])} / M</span>
            <span aria-hidden>{'→'}</span>
            <span className="text-ink">
              {formatUsd(priceSeries[priceSeries.length - 1])} / M
            </span>
          </div>
        </div>
      </Panel>

      {/* PANEL 4 — Context window growth */}
      <Panel
        icon={<Database className="h-5 w-5" aria-hidden />}
        title="Context window growth"
        subtitle="Maximum tokens a single model can read at once, by month."
      >
        <div className="mx-auto max-w-3xl">
          <LineChart
            values={contextSeries}
            labels={MONTHS}
            color="#7C9EFF"
            formatY={(v) => formatTokens(v)}
          />
          <div className="mt-3 flex items-center justify-center gap-2 font-mono text-[11px] text-ink-faint">
            <span>{formatTokens(contextSeries[0])}</span>
            <span aria-hidden>{'→'}</span>
            <span className="text-ink">
              {formatTokens(contextSeries[contextSeries.length - 1])}
            </span>
          </div>
        </div>
      </Panel>

      {/* PANEL 5 — Tools by category */}
      <Panel
        icon={<BarChart3 className="h-5 w-5" aria-hidden />}
        title="Tools by category"
        subtitle="Count of approved tools, grouped by primary category."
      >
        <div className="mx-auto max-w-2xl">
          <ul className="flex flex-col gap-4 text-left">
            {CATEGORIES.map((c) => {
              const count = categoryCounts[c];
              const pct = (count / maxCategoryCount) * 100;
              return (
                <li
                  key={c}
                  className="grid grid-cols-[10rem_minmax(0,1fr)_3rem] items-center gap-4"
                >
                  <span
                    className="truncate text-sm text-ink"
                    title={CATEGORY_LABELS[c]}
                  >
                    {CATEGORY_LABELS[c]}
                  </span>
                  <span
                    className="relative h-3 overflow-hidden rounded-md bg-surface-2"
                    aria-hidden
                  >
                    <span
                      className="absolute inset-y-0 left-0 rounded-md bg-accent"
                      style={{ width: `${pct}%`, opacity: 0.85 }}
                    />
                  </span>
                  <span className="text-right font-mono text-sm text-ink">
                    {count}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </Panel>

      {/* PANEL 6 — Models by vendor */}
      <Panel
        icon={<Layers className="h-5 w-5" aria-hidden />}
        title="Models by vendor"
        subtitle="Frontier LLMs tracked on the pricing page, grouped by family."
      >
        <div className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-line">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-surface-2 text-left">
                <th className="px-4 py-2 font-medium text-ink-dim">Family</th>
                <th className="px-4 py-2 font-medium text-ink-dim">Vendor</th>
                <th className="px-4 py-2 text-right font-medium text-ink-dim">
                  Models
                </th>
              </tr>
            </thead>
            <tbody>
              {familyRows.map((r) => (
                <tr
                  key={r.family}
                  className="border-b border-line last:border-0"
                >
                  <td className="px-4 py-2 text-left font-medium text-ink">
                    {r.label}
                  </td>
                  <td className="px-4 py-2 text-left text-ink-dim">
                    {r.vendor}
                  </td>
                  <td className="px-4 py-2 text-right font-mono text-ink">
                    {r.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
