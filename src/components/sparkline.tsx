interface Props {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
}

/**
 * Pure-SVG sparkline. Normalizes values to the available height and renders a
 * polyline plus a small dot at the latest point. No deps, no client JS.
 */
export function Sparkline({
  values,
  width = 80,
  height = 24,
  color,
}: Props) {
  const stroke = color ?? '#FF6B5B';
  const n = values.length;

  // Degenerate input: render a flat baseline so the SVG never collapses.
  if (n === 0) {
    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        className="inline-block"
      >
        <line
          x1={0}
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke={stroke}
          strokeWidth={1.5}
        />
      </svg>
    );
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  // Padding keeps the stroke (and end dot) from clipping at edges.
  const pad = 2;
  const innerH = height - pad * 2;
  const innerW = width - pad * 2;
  const stepX = n > 1 ? innerW / (n - 1) : 0;

  const points = values
    .map((v, i) => {
      const x = pad + i * stepX;
      // Invert y so high values sit at the top of the viewBox.
      const y = pad + innerH - ((v - min) / range) * innerH;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  const lastV = values[n - 1] ?? 0;
  const lastX = pad + (n - 1) * stepX;
  const lastY = pad + innerH - ((lastV - min) / range) * innerH;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className="inline-block"
    >
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      <circle cx={lastX} cy={lastY} r="2" fill={stroke} />
    </svg>
  );
}

export default Sparkline;
