import type { StrengthAxis } from '@/lib/types';

interface Props {
  a: StrengthAxis[] | null;
  b: StrengthAxis[] | null;
  aName: string;
  bName: string;
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

const COLOR_A = '#FF6B5B';
const COLOR_B = '#4285F4';

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
  if (i === 0) return 'middle';
  if (i === 1 || i === 2) return 'start';
  return 'end';
}

function scoreFor(strengths: StrengthAxis[], axis: StrengthAxis['axis']): number {
  const found = strengths.find((s) => s.axis === axis);
  if (!found) return 0;
  const v = Number(found.score);
  if (Number.isNaN(v)) return 0;
  return Math.max(0, Math.min(10, v));
}

function polygonFor(strengths: StrengthAxis[]) {
  const pts = AXES.map((axis, i) => {
    const score = scoreFor(strengths, axis);
    return vertex(i, score / 10);
  });
  return {
    points: pts.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' '),
    vertices: pts,
  };
}

export function CompareRadarOverlay({ a, b, aName, bName }: Props) {
  if ((!a || a.length === 0) && (!b || b.length === 0)) return null;

  const polyA = a && a.length > 0 ? polygonFor(a) : null;
  const polyB = b && b.length > 0 ? polygonFor(b) : null;

  return (
    <div className="rounded-xl border border-line bg-surface-1 p-6">
      <svg
        viewBox="0 0 320 320"
        xmlns="http://www.w3.org/2000/svg"
        className="mx-auto h-auto w-full max-w-md"
        role="img"
        aria-label={`Strengths comparison radar chart: ${aName} vs ${bName}`}
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

        {polyA && (
          <>
            <polygon
              points={polyA.points}
              fill="rgba(255,107,91,0.18)"
              stroke={COLOR_A}
              strokeWidth={2}
            />
            {polyA.vertices.map((p, i) => (
              <circle key={`a-${i}`} cx={p.x} cy={p.y} r={3} fill={COLOR_A} />
            ))}
          </>
        )}

        {polyB && (
          <>
            <polygon
              points={polyB.points}
              fill="rgba(66,133,244,0.18)"
              stroke={COLOR_B}
              strokeWidth={2}
            />
            {polyB.vertices.map((p, i) => (
              <circle key={`b-${i}`} cx={p.x} cy={p.y} r={3} fill={COLOR_B} />
            ))}
          </>
        )}

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

      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-dim">
        <div className="inline-flex items-center gap-2">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: COLOR_A }}
            aria-hidden
          />
          <span>{aName}</span>
        </div>
        <div className="inline-flex items-center gap-2">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: COLOR_B }}
            aria-hidden
          />
          <span>{bName}</span>
        </div>
      </div>
    </div>
  );
}

export default CompareRadarOverlay;
