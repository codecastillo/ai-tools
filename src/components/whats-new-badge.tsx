import { Zap } from 'lucide-react';
import type { Tool } from '@/lib/types';

interface Props {
  tool: Tool;
}

// Accent border allowed here because the chip IS the affordance ("this is new").
// Without the colored border the badge would not read as a status pill.
export default function WhatsNewBadge({ tool }: Props) {
  if (!tool.created_at) return null;

  const createdAt = new Date(tool.created_at);
  if (Number.isNaN(createdAt.getTime())) return null;

  const days = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  if (days > 14) return null;

  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-accent/30 bg-accent/[0.10] px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-accent">
      <Zap className="h-2.5 w-2.5" />
      NEW
    </span>
  );
}
