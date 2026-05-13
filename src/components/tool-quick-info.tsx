import type { Tool } from '@/lib/types';
import { ArrowUpRight, Check } from 'lucide-react';
import { cn } from '@/lib/cn';

interface ToolQuickInfoProps {
  tool: Tool;
}

export default function ToolQuickInfo({ tool }: ToolQuickInfoProps) {
  const lastVerified = tool.last_verified ? tool.last_verified.slice(0, 10) : null;

  // Only render rows that have data, keeps the card focused.
  const rows: Array<{ label: string; value: React.ReactNode }> = [];
  if (tool.pricing) rows.push({ label: 'Pricing', value: <span className="capitalize">{tool.pricing}</span> });
  if (tool.difficulty) rows.push({ label: 'Difficulty', value: <span className="capitalize">{tool.difficulty}</span> });
  if (tool.time_to_value) rows.push({ label: 'Time to value', value: tool.time_to_value });
  if (lastVerified)
    rows.push({
      label: 'Last verified',
      value: (
        <span className="inline-flex items-center gap-1">
          <Check className="h-3 w-3 text-success" />
          {lastVerified}
        </span>
      ),
    });

  return (
    <div
      aria-label="Quick info"
      className="rounded-2xl border border-line-2 bg-[--color-surface] p-5 space-y-4 text-center"
    >
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">
        Quick info
      </p>

      {rows.length > 0 && (
        <dl className="space-y-3">
          {rows.map((row) => (
            <div key={row.label} className="flex flex-col items-center text-center">
              <dt className="text-xs text-ink-faint">{row.label}</dt>
              <dd className="mt-1 text-sm text-ink">{row.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {tool.tags.length > 0 && (
        <div>
          <p className="mb-2 text-xs text-ink-faint">Tags</p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {tool.tags.slice(0, 8).map((tag) => (
              <span
                key={tag}
                className={cn(
                  'inline-flex items-center rounded-md border border-line-2 bg-surface-1 px-2 py-0.5',
                  'text-[11px] text-ink-mute',
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <a
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-accent px-3 py-2',
          'text-sm font-medium text-white transition-colors hover:bg-accent-bright',
        )}
      >
        Visit website
        <ArrowUpRight className="h-4 w-4" />
      </a>
    </div>
  );
}
