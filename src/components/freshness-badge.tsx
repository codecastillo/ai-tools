import { Clock } from 'lucide-react';
import type { Tool } from '@/lib/types';

interface Props {
  tool: Tool;
}

export default function FreshnessBadge({ tool }: Props) {
  if (!tool.last_verified) return null;

  const verifiedAt = new Date(tool.last_verified);
  if (Number.isNaN(verifiedAt.getTime())) return null;

  const now = Date.now();
  const days = Math.max(0, Math.floor((now - verifiedAt.getTime()) / (1000 * 60 * 60 * 24)));

  let dotColor = 'bg-success';
  let textColor = 'text-success';
  let label: string;

  if (days <= 7) {
    dotColor = 'bg-success';
    textColor = 'text-success';
    label = days === 0 ? 'Verified today' : `Verified ${days} days ago`;
  } else if (days <= 30) {
    dotColor = 'bg-warning';
    textColor = 'text-warning';
    label = `Verified ${days} days ago`;
  } else {
    dotColor = 'bg-accent-2';
    textColor = 'text-accent-2';
    label = `Verified ${days} days ago, may be stale`;
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs">
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      <Clock className="h-3 w-3 text-ink-faint" />
      <span className={textColor}>{label}</span>
    </span>
  );
}
