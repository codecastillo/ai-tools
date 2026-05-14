import { Clock } from 'lucide-react';
import type { Tool } from '@/lib/types';

interface Props {
  tool: Tool;
}

const WORDS_PER_MINUTE = 220;

function countWords(md: string | null): number {
  if (!md) return 0;
  const trimmed = md.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export default function ReadingTime({ tool }: Props) {
  const total =
    countWords(tool.install_md) +
    countWords(tool.usage_md) +
    countWords(tool.cheatsheet_md) +
    countWords(tool.pricing_md) +
    countWords(tool.resources_md);

  if (total === 0) return null;

  const minutes = Math.max(1, Math.round(total / WORDS_PER_MINUTE));

  return (
    <span className="inline-flex items-center gap-1 text-xs text-ink-faint">
      <Clock className="h-3 w-3" />
      {minutes} min read
    </span>
  );
}
