import {
  BENCHMARK_LABEL,
  getScore,
  type BenchmarkRow,
  type BenchmarkAxis,
} from '@/lib/benchmarks';

interface Props {
  rows: BenchmarkRow[];
}

const AXES: BenchmarkAxis[] = [
  'mmlu',
  'humaneval',
  'math',
  'gpqa',
  'swebench',
  'mtbench',
];

const PALETTE = [
  '#FF6B5B',
  '#10A37F',
  '#4285F4',
  '#FFB347',
  '#7C3AED',
  '#FFFFFF',
];

const CX = 200;
const CY = 200;
const RADIUS = 140;

function vertex(i: number, scale: number) {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / AXES.length;
  return {
    x: CX + Math.cos(angle) * RADIUS * scale,
    y: CY + Math.sin(angle) * RADIUS * scale,
    angle,
  };
}

function ringPoints(scale: number) {
  return AXES.map((_, i) => {
    const v = vertex(i, scale);
    return `${v.x.toFixed(2)},${v.y.toFixed(2)}`;
  }).join(' ');
}

function textAnchorFor(i: number): 'start' | 'middle' | 'end' {
  // 6 vertices, starting at top going clockwise.
  // i=0 top, i=3 bottom -> middle. i=1,2 right -> start. i=4,5 left -> end.
  if (i === 0 || i === 3) return 'middle';
  if (i === 1 || i === 2) return 'start';
  return 'end';
}

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function BenchmarkRadar({ rows }: Props) {
  if (!rows || rows.length === 0) return null;

  return (
    <div>
      <svg
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto max-w-md mx-auto"
        role="img"
        aria-label="Benchmark radar chart"
      >
        {[0.25, 0.5, 0.75, 1].map((scale) => (
          <polygon
            key={scale}
            points={ringPoints(scale)}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
          />
        ))}

        {AXES.map((_, i) => {
          const v = vertex(i, 1);
          return (
            <line
              key={i}
              x1={CX}
              y1={CY}
              x2={v.x}
              y2={v.y}
              stroke="rgba(255,255,255,0.06)"
            />
          );
        })}

        {rows.map((row, rowIdx) => {
          const color = PALETTE[rowIdx % PALETTE.length];
          const dataPoints = AXES.map((axis, i) => {
            const raw = getScore(row, axis);
            const clamped = Math.max(0, Math.min(100, raw));
            return { ...vertex(i, clamped / 100), axis, score: clamped };
          });
          const polygonPoints = dataPoints
            .map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`)
            .join(' ');
          return (
            <g key={row.model_id}>
              <polygon
                points={polygonPoints}
                fill={hexToRgba(color, 0.15)}
                stroke={color}
                strokeWidth={2}
              />
              {dataPoints.map((p) => (
                <circle
                  key={`${row.model_id}-${p.axis}`}
                  cx={p.x}
                  cy={p.y}
                  r={3}
                  fill={color}
                />
              ))}
            </g>
          );
        })}

        {AXES.map((axis, i) => {
          const v = vertex(i, 1.15);
          return (
            <text
              key={axis}
              x={v.x}
              y={v.y}
              textAnchor={textAnchorFor(i)}
              dominantBaseline="middle"
              fill="rgba(255,255,255,0.7)"
              style={{ fontSize: 12 }}
            >
              {BENCHMARK_LABEL[axis]}
            </text>
          );
        })}
      </svg>

      <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        {rows.map((row, rowIdx) => {
          const color = PALETTE[rowIdx % PALETTE.length];
          return (
            <li
              key={row.model_id}
              className="flex items-center gap-2 text-xs text-ink-dim"
            >
              <span
                aria-hidden
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-ink">{row.model}</span>
              <span className="text-ink-faint">{row.vendor}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default BenchmarkRadar;
