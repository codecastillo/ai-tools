import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Props {
  popularity: number;
}

export default function TrendingIndicator({ popularity }: Props) {
  const bucket = Math.abs(Math.trunc(popularity * 13)) % 3;
  const rawDelta = (Math.abs(Math.trunc(popularity * 7)) % 9) - 4;

  if (bucket === 0) {
    // Down: clamp to a negative magnitude in [1, 5]
    const magnitude = Math.min(5, Math.max(1, Math.abs(rawDelta) || 3));
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-mono text-red-400">
        <TrendingDown className="h-2.5 w-2.5" />
        {`-${magnitude}`}
      </span>
    );
  }

  if (bucket === 1) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-mono text-ink-faint">
        <Minus className="h-2.5 w-2.5" />
        0
      </span>
    );
  }

  // Up: clamp to a positive magnitude in [1, 9]
  const magnitude = Math.min(9, Math.max(1, Math.abs(rawDelta) + 1));
  return (
    <span className="inline-flex items-center gap-0.5 text-[10px] font-mono text-success">
      <TrendingUp className="h-2.5 w-2.5" />
      {`+${magnitude}`}
    </span>
  );
}
