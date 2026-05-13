import {
  FAMILY_LABEL,
  type LLMRate,
  type LLMFamily,
} from '@/lib/llm-rates';

interface Props {
  rates: LLMRate[];
}

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

// Viewbox & inner plotting frame.
const VB_W = 480;
const VB_H = 320;
const PAD_T = 20;
const PAD_R = 30;
const PAD_B = 40;
const PAD_L = 50;
const PLOT_W = VB_W - PAD_L - PAD_R;
const PLOT_H = VB_H - PAD_T - PAD_B;

// Log-ish scales chosen to spread the visible field. Match the chosen tick
// labels so the axis ranges line up with the printed values.
const X_TICKS: number[] = [0.1, 1, 5, 20];
const Y_TICKS: number[] = [100_000, 200_000, 1_000_000, 2_000_000];

function xScale(price: number): number {
  const v = Math.log10(price + 0.1);
  const min = Math.log10(X_TICKS[0]! + 0.1);
  const max = Math.log10(X_TICKS[X_TICKS.length - 1]! + 0.1);
  const t = (v - min) / (max - min);
  return PAD_L + t * PLOT_W;
}

function yScale(context: number): number {
  const v = Math.log2(context / 1000);
  const min = Math.log2(Y_TICKS[0]! / 1000);
  const max = Math.log2(Y_TICKS[Y_TICKS.length - 1]! / 1000);
  const t = (v - min) / (max - min);
  // Invert so larger context windows sit higher in the chart.
  return PAD_T + (1 - t) * PLOT_H;
}

function dotRadius(output: number, allOutputs: number[]): number {
  const min = Math.min(...allOutputs);
  const max = Math.max(...allOutputs);
  const range = max - min || 1;
  const t = (output - min) / range;
  // Smooth curve so the cheap models stay readable next to the expensive ones.
  return 4 + Math.sqrt(t) * 6;
}

function formatPriceTick(p: number): string {
  if (p < 1) return `$${p.toFixed(1)}`;
  return `$${p.toFixed(0)}`;
}

function formatContextTick(c: number): string {
  if (c >= 1_000_000) {
    const m = c / 1_000_000;
    return `${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
  }
  return `${(c / 1000).toFixed(0)}K`;
}

function formatUsd(n: number): string {
  return `$${n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function PriceScatter({ rates }: Props) {
  const outputs = rates.map((r) => r.output);
  const familyKeys = Object.keys(FAMILY_LABEL) as LLMFamily[];
  const familiesPresent = familyKeys.filter((f) =>
    rates.some((r) => r.family === f),
  );

  // 4 evenly spaced gridlines across each axis.
  const horizontalGrid = Array.from({ length: 4 }, (_, i) => {
    const t = i / 3;
    return PAD_T + t * PLOT_H;
  });
  const verticalGrid = Array.from({ length: 4 }, (_, i) => {
    const t = i / 3;
    return PAD_L + t * PLOT_W;
  });

  return (
    <div className="rounded-xl border border-line bg-surface-1 p-6">
      <h3 className="text-sm uppercase tracking-wider text-ink-faint text-center mb-4">
        Price vs context window
      </h3>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Scatter plot of LLM input price versus context window size"
      >
        {/* Background grid */}
        {horizontalGrid.map((y, i) => (
          <line
            key={`hg-${i}`}
            x1={PAD_L}
            y1={y}
            x2={VB_W - PAD_R}
            y2={y}
            stroke="rgba(255,255,255,0.04)"
          />
        ))}
        {verticalGrid.map((x, i) => (
          <line
            key={`vg-${i}`}
            x1={x}
            y1={PAD_T}
            x2={x}
            y2={VB_H - PAD_B}
            stroke="rgba(255,255,255,0.04)"
          />
        ))}

        {/* Axis lines */}
        <line
          x1={PAD_L}
          y1={VB_H - PAD_B}
          x2={VB_W - PAD_R}
          y2={VB_H - PAD_B}
          stroke="rgba(255,255,255,0.18)"
        />
        <line
          x1={PAD_L}
          y1={PAD_T}
          x2={PAD_L}
          y2={VB_H - PAD_B}
          stroke="rgba(255,255,255,0.18)"
        />

        {/* X tick labels */}
        {X_TICKS.map((p) => {
          const x = xScale(p);
          return (
            <text
              key={`xt-${p}`}
              x={x}
              y={VB_H - PAD_B + 14}
              textAnchor="middle"
              fill="rgba(255,255,255,0.5)"
              style={{ fontSize: 10 }}
            >
              {formatPriceTick(p)}
            </text>
          );
        })}

        {/* Y tick labels */}
        {Y_TICKS.map((c) => {
          const y = yScale(c);
          return (
            <text
              key={`yt-${c}`}
              x={PAD_L - 8}
              y={y}
              textAnchor="end"
              dominantBaseline="middle"
              fill="rgba(255,255,255,0.5)"
              style={{ fontSize: 10 }}
            >
              {formatContextTick(c)}
            </text>
          );
        })}

        {/* X axis label */}
        <text
          x={PAD_L + PLOT_W / 2}
          y={VB_H - 8}
          textAnchor="middle"
          fill="rgba(255,255,255,0.6)"
          style={{ fontSize: 11 }}
        >
          Input $/M
        </text>

        {/* Y axis label */}
        <text
          x={14}
          y={PAD_T + PLOT_H / 2}
          textAnchor="middle"
          fill="rgba(255,255,255,0.6)"
          style={{ fontSize: 11 }}
          transform={`rotate(-90 14 ${PAD_T + PLOT_H / 2})`}
        >
          Context window
        </text>

        {/* Data points */}
        {rates.map((r) => {
          const cx = xScale(r.input);
          const cy = yScale(r.context_window);
          const radius = dotRadius(r.output, outputs);
          return (
            <circle
              key={r.id}
              cx={cx}
              cy={cy}
              r={radius}
              fill={FAMILY_COLOR[r.family]}
              fillOpacity={0.85}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={1}
            >
              <title>
                {`${r.model} · input ${formatUsd(r.input)} · output ${formatUsd(
                  r.output,
                )}`}
              </title>
            </circle>
          );
        })}
      </svg>

      {/* Family legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
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
