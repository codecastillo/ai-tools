export default function HeroIllustration() {
  const dots = [
    { x: 80, y: 60, r: 4 }, { x: 200, y: 110, r: 6 },
    { x: 360, y: 80, r: 3 }, { x: 480, y: 160, r: 5 },
    { x: 620, y: 70, r: 4 }, { x: 720, y: 130, r: 6 },
    { x: 140, y: 200, r: 3 }, { x: 300, y: 230, r: 5 },
    { x: 440, y: 250, r: 4 }, { x: 580, y: 220, r: 3 },
    { x: 700, y: 240, r: 4 }, { x: 50, y: 140, r: 5 },
  ];
  const edges: Array<[number, number]> = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
    [6, 7], [7, 8], [8, 9], [9, 10],
    [0, 11], [11, 6], [2, 11], [3, 7],
  ];
  return (
    <svg
      viewBox="0 0 800 300"
      className="w-full h-auto opacity-60 pointer-events-none"
      aria-hidden="true"
    >
      <g className="animate-pulse">
        {edges.map(([a, b], i) => (
          <line
            key={i}
            x1={dots[a].x}
            y1={dots[a].y}
            x2={dots[b].x}
            y2={dots[b].y}
            stroke="var(--color-accent)"
            strokeOpacity="0.15"
            strokeWidth="1"
          />
        ))}
      </g>
      {dots.map((d, i) => (
        <circle
          key={i}
          cx={d.x}
          cy={d.y}
          r={d.r}
          fill="var(--color-accent)"
          fillOpacity={0.3 + (i % 3) * 0.2}
        />
      ))}
    </svg>
  );
}
