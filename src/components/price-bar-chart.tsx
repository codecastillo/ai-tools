import { type LLMRate, type LLMFamily } from '@/lib/llm-rates';

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

const VB_W = 480;
const ROW_H = 36;
const TOP_PAD = 12;
const BOTTOM_PAD = 28;

// Layout columns within the SVG.
const LABEL_X = 4;
const LABEL_W = 130;
const BAR_X = LABEL_W + 8;
const VALUE_W = 60;
const MAX_BAR_W = VB_W - BAR_X - VALUE_W - 8;

function truncate(s: string, max = 22): string {
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1)}…`;
}

function formatUsd(n: number): string {
  if (n < 1) {
    return `$${n.toFixed(2)}`;
  }
  if (n % 1 === 0) {
    return `$${n.toFixed(0)}`;
  }
  return `$${n.toFixed(2)}`;
}

// Lighten a hex color by mixing it with white. Used so the output bar reads as
// the "same family" as the input bar without being a pure transparency overlay.
function lighten(hex: string, amount = 0.4): string {
  const h = hex.replace('#', '');
  if (h.length !== 6) return hex;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const mix = (c: number) =>
    Math.round(c + (255 - c) * amount)
      .toString(16)
      .padStart(2, '0');
  return `#${mix(r)}${mix(g)}${mix(b)}`;
}

export default function PriceBarChart({ rates }: Props) {
  const sorted = [...rates].sort((a, b) => a.input - b.input);
  const maxRate = Math.max(...rates.map((r) => Math.max(r.input, r.output)), 1);
  const height = sorted.length * ROW_H + TOP_PAD + BOTTOM_PAD;

  return (
    <div className="rounded-xl border border-line bg-surface-1 p-6 overflow-x-auto">
      <h3 className="text-sm uppercase tracking-wider text-ink-faint text-center mb-4">
        Input vs output rate
      </h3>
      <svg
        viewBox={`0 0 ${VB_W} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Grouped bar chart of LLM input versus output rates"
      >
        {sorted.map((r, i) => {
          const rowY = TOP_PAD + i * ROW_H;
          const inputW = (r.input / maxRate) * MAX_BAR_W;
          const outputW = (r.output / maxRate) * MAX_BAR_W;
          const color = FAMILY_COLOR[r.family];
          const lightColor = lighten(color, 0.55);

          const outputBarH = 14;
          const inputBarH = 8;
          const outputBarY = rowY + 8;
          const inputBarY = outputBarY + (outputBarH - inputBarH) / 2;

          return (
            <g key={r.id}>
              {/* Row label */}
              <text
                x={LABEL_X}
                y={rowY + ROW_H / 2}
                dominantBaseline="middle"
                fill="rgba(255,255,255,0.8)"
                style={{ fontSize: 11 }}
              >
                <title>{r.model}</title>
                {truncate(r.model)}
              </text>

              {/* Output bar (drawn first, under the input bar) */}
              <rect
                x={BAR_X}
                y={outputBarY}
                width={Math.max(outputW, 1)}
                height={outputBarH}
                rx={2}
                fill={lightColor}
                fillOpacity={0.45}
              >
                <title>{`${r.model} output ${formatUsd(r.output)} / M`}</title>
              </rect>

              {/* Input bar (drawn on top) */}
              <rect
                x={BAR_X}
                y={inputBarY}
                width={Math.max(inputW, 1)}
                height={inputBarH}
                rx={2}
                fill={color}
                fillOpacity={0.95}
              >
                <title>{`${r.model} input ${formatUsd(r.input)} / M`}</title>
              </rect>

              {/* Single inline label combines input and output rates with a
                  slash separator so they cannot overlap each other. */}
              <text
                x={BAR_X + Math.max(inputW, outputW) + 8}
                y={outputBarY + outputBarH / 2}
                dominantBaseline="middle"
                fill="rgba(255,255,255,0.85)"
                style={{ fontSize: 10 }}
              >
                <tspan fill="rgba(255,255,255,0.95)">{formatUsd(r.input)}</tspan>
                <tspan fill="rgba(255,255,255,0.45)" dx="3"> / </tspan>
                <tspan fill="rgba(255,255,255,0.65)" dx="3">{formatUsd(r.output)}</tspan>
                <tspan fill="rgba(255,255,255,0.45)" dx="4">/M</tspan>
              </text>
            </g>
          );
        })}

        {/* Bottom legend */}
        <g transform={`translate(${BAR_X}, ${height - 14})`}>
          <rect x={0} y={0} width={14} height={8} rx={2} fill="#FF6B5B" />
          <text
            x={20}
            y={4}
            dominantBaseline="middle"
            fill="rgba(255,255,255,0.65)"
            style={{ fontSize: 10 }}
          >
            Input rate
          </text>
          <rect
            x={90}
            y={-2}
            width={14}
            height={12}
            rx={2}
            fill={lighten('#FF6B5B', 0.55)}
            fillOpacity={0.45}
          />
          <text
            x={110}
            y={4}
            dominantBaseline="middle"
            fill="rgba(255,255,255,0.65)"
            style={{ fontSize: 10 }}
          >
            Output rate
          </text>
        </g>
      </svg>
    </div>
  );
}
