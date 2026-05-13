'use client';

import { useTransition } from 'react';
import { Check, X, Trash2, ExternalLink } from 'lucide-react';
import type { Tool } from '@/lib/types';
import { approveTool, rejectTool, deleteTool } from '@/app/admin/actions';
import { categoryStyle } from '@/lib/categories';
import { cn } from '@/lib/cn';

export default function AdminQueue({ tool }: { tool: Tool }) {
  const [isPending, start] = useTransition();
  const cat = categoryStyle(tool.category);

  function act(fn: () => Promise<unknown>) {
    start(async () => {
      await fn();
    });
  }

  return (
    <div className="flex items-start gap-4 rounded-xl border border-white/[0.10] bg-[--color-surface] px-5 py-4">
      <span className={cn('mt-2 h-2 w-2 rounded-full', cat.dotClass)} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-base font-medium text-ink">{tool.title}</h3>
          {tool.submitter && (
            <span className="text-xs text-ink-faint">by {tool.submitter}</span>
          )}
        </div>
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-0.5 inline-flex items-center gap-1 text-xs text-ink-mute hover:text-accent"
        >
          {tool.url}
          <ExternalLink className="h-3 w-3" />
        </a>
        {tool.description && (
          <p className="mt-2 text-sm text-ink-dim line-clamp-2">{tool.description}</p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        {tool.status === 'pending' && (
          <>
            <button
              type="button"
              onClick={() => act(() => approveTool(tool.id))}
              disabled={isPending}
              className="inline-flex items-center gap-1 rounded-md border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-medium text-success transition-colors hover:bg-success/20 disabled:opacity-50"
            >
              <Check className="h-3.5 w-3.5" />
              Approve
            </button>
            <button
              type="button"
              onClick={() => act(() => rejectTool(tool.id))}
              disabled={isPending}
              className="inline-flex items-center gap-1 rounded-md border border-white/[0.10] bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-ink-mute transition-colors hover:bg-white/[0.05] disabled:opacity-50"
            >
              <X className="h-3.5 w-3.5" />
              Reject
            </button>
          </>
        )}
        <button
          type="button"
          onClick={() => {
            if (confirm(`Delete "${tool.title}"?`)) act(() => deleteTool(tool.id));
          }}
          disabled={isPending}
          aria-label={`Delete ${tool.title}`}
          className="inline-flex items-center justify-center rounded-md p-1.5 text-ink-faint transition-colors hover:bg-white/[0.05] hover:text-danger disabled:opacity-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
