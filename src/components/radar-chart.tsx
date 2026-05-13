import type { StrengthAxis } from '@/lib/types';

interface Props {
  strengths: StrengthAxis[] | null;
}

const AXES: StrengthAxis['axis'][] = ['speed', 'accuracy', 'price', 'ecosystem', 'ease'];

const AXIS_LABEL: Record<StrengthAxis['axis'], string> = {
  speed: 'Speed',
  accuracy: 'Accuracy',
  price: 'Price',
  ecosystem: 'Ecosystem',
  ease: 'Ease',
};

const CX = 160;
const CY = 160;
const RADIUS = 110;

function vertex(i: number, scale: number) {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
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
  // i=0 is top, then clockwise: top-right, bottom-right, bottom-left, top-left
  if (i === 0) return 'middle';
  if (i === 1 || i === 2) return 'start';
  return 'end';
}

export function RadarChart({ strengths }: Props) {
  if (!strengths || strengths.length === 0) return null;

  const scoreFor = (axis: StrengthAxis['axis']): number => {
    const found = strengths.find((s) => s.axis === axis);
    if (!found) return 0;
    const v = Number(found.score);
    if (Number.isNaN(v)) return 0;
    return Math.max(0, Math.min(10, v));
  };

  const dataPoints = AXES.map((axis, i) => {
    const score = scoreFor(axis);
    return { ...vertex(i, score / 10), axis, score };
  });

  const polygonPoints = dataPoints
    .map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(' ');

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-6">
      <h3 className="text-sm uppercase tracking-wider text-ink-faint text-center mb-4">
        Strengths
      </h3>
      <svg
        viewBox="0 0 320 320"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Strengths radar chart"
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

        <polygon
          points={polygonPoints}
          fill="rgba(255,107,91,0.15)"
          stroke="#FF6B5B"
          strokeWidth={2}
        />

        {dataPoints.map((p) => (
          <circle key={p.axis} cx={p.x} cy={p.y} r={3} fill="#FF6B5B" />
        ))}

        {AXES.map((axis, i) => {
          const v = vertex(i, 1.2);
          return (
            <text
              key={axis}
              x={v.x}
              y={v.y}
              textAnchor={textAnchorFor(i)}
              dominantBaseline="middle"
              fill="rgba(255,255,255,0.6)"
              style={{ fontSize: 11 }}
            >
              {AXIS_LABEL[axis]}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

export default RadarChart;
