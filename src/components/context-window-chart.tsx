import { LLM_RATES, FAMILY_LABEL, type LLMFamily } from '@/lib/llm-rates';
import { findFit } from '@/lib/context-fits';

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

// Log-scale tick positions across the bar track. 8K..2M spans a wide range
// so we bucket via log2 so smaller windows remain visible alongside 2M.
const TICKS: { tokens: number; label: string }[] = [
  { tokens: 8_000, label: '8K' },
  { tokens: 32_000, label: '32K' },
  { tokens: 128_000, label: '128K' },
  { tokens: 200_000, label: '200K' },
  { tokens: 1_000_000, label: '1M' },
  { tokens: 2_000_000, label: '2M' },
];

function widthPct(context: number): number {
  // Math.log2(context / 1000) / Math.log2(2000) * 100
  const pct = (Math.log2(context / 1000) / Math.log2(2000)) * 100;
  return Math.max(0, Math.min(100, pct));
}

function formatContext(c: number): string {
  if (c >= 1_000_000) {
    const m = c / 1_000_000;
    return `${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
  }
  return `${Math.round(c / 1000)}K`;
}

function truncate(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s;
}

export default function ContextWindowChart() {
  const rows = [...LLM_RATES].sort(
    (a, b) => b.context_window - a.context_window,
  );

  const familyKeys = Object.keys(FAMILY_LABEL) as LLMFamily[];
  const familiesPresent = familyKeys.filter((f) =>
    rows.some((r) => r.family === f),
  );

  return (
    <div className="rounded-xl border border-line bg-surface-1 p-6">
      <h3 className="text-sm uppercase tracking-wider text-ink-faint text-center mb-6">
        Context windows compared
      </h3>

      {/* Tick baseline aligned with the bar track */}
      <div className="grid grid-cols-[12rem_minmax(0,1fr)_8rem] gap-4 items-end mb-2">
        <div />
        <div className="relative h-6">
          {TICKS.map((t) => (
            <div
              key={t.label}
              className="absolute top-0 bottom-0 flex flex-col items-center"
              style={{ left: `${widthPct(t.tokens)}%`, transform: 'translateX(-50%)' }}
            >
              <span className="text-[10px] text-ink-faint leading-none">
                {t.label}
              </span>
              <span className="mt-1 h-2 w-px bg-line-3" />
            </div>
          ))}
        </div>
        <div />
      </div>

      <div className="flex flex-col gap-3">
        {rows.map((r) => {
          const w = widthPct(r.context_window);
          const fit = findFit(r.context_window);
          const color = FAMILY_COLOR[r.family];
          return (
            <div
              key={r.id}
              className="grid grid-cols-[12rem_minmax(0,1fr)_8rem] gap-4 items-center"
            >
              {/* Model name + vendor */}
              <div className="min-w-0">
                <div
                  className="text-sm text-ink font-medium truncate"
                  title={r.model}
                >
                  {truncate(r.model, 24)}
                </div>
                <div
                  className="text-[11px] text-ink-faint truncate"
                  title={r.vendor}
                >
                  {r.vendor}
                </div>
              </div>

              {/* Bar */}
              <div className="relative h-7 rounded-md bg-surface-2 overflow-hidden">
                {/* Tick guides */}
                {TICKS.map((t) => (
                  <span
                    key={`g-${t.label}`}
                    className="absolute top-0 bottom-0 w-px bg-line"
                    style={{ left: `${widthPct(t.tokens)}%` }}
                    aria-hidden
                  />
                ))}
                <div
                  className="absolute inset-y-0 left-0 rounded-md"
                  style={{
                    width: `${w}%`,
                    backgroundColor: color,
                    opacity: 0.85,
                  }}
                  title={`${r.model} · ${formatContext(r.context_window)} tokens`}
                />
              </div>

              {/* Right label + fit caption */}
              <div className="min-w-0">
                <div className="text-sm text-ink font-medium">
                  {formatContext(r.context_window)}
                </div>
                <div className="text-[11px] text-ink-faint italic truncate">
                  fits {fit.what_fits.toLowerCase()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Family legend */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        {familiesPresent.map((fam) => (
          <div key={fam} className="inline-flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: FAMILY_COLOR[fam] }}
              aria-hidden
            />
            <span className="text-[11px] text-ink-dim">
              {FAMILY_LABEL[fam]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
