'use client';

import { useEffect, useState } from 'react';
import { Check, Plus } from 'lucide-react';
import {
  addToDraft,
  getDraft,
  onDraftChange,
  removeFromDraft,
} from '@/lib/draft-stack';
import { cn } from '@/lib/cn';

interface AddToStackButtonProps {
  toolId: string;
  title: string;
}

export default function AddToStackButton({ toolId, title }: AddToStackButtonProps) {
  const [inStack, setInStack] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setInStack(getDraft().includes(toolId));
    const unsub = onDraftChange((ids) => setInStack(ids.includes(toolId)));
    return unsub;
  }, [toolId]);

  // Avoid hydration mismatch: render an inert placeholder until mounted.
  if (!mounted) {
    return (
      <span
        aria-hidden
        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.06] bg-[--color-surface]/60 text-ink-faint opacity-0"
      />
    );
  }

  return (
    <button
      type="button"
      aria-label={inStack ? `Remove ${title} from stack` : `Add ${title} to stack`}
      title={inStack ? 'In stack' : 'Add to stack'}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (inStack) removeFromDraft(toolId);
        else addToDraft(toolId);
      }}
      className={cn(
        'group/add inline-flex h-7 items-center gap-1 rounded-md border px-1.5 text-[11px] font-medium transition-all',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
        inStack
          ? 'border-accent/40 bg-accent/10 text-accent-bright hover:border-accent/60 hover:bg-accent/15'
          : 'border-white/[0.08] bg-[--color-surface]/80 text-ink-faint backdrop-blur-sm hover:border-accent/40 hover:bg-accent/10 hover:text-accent-bright',
      )}
    >
      {inStack ? (
        <>
          <Check className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">In stack</span>
        </>
      ) : (
        <>
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden opacity-0 transition-opacity group-hover/add:opacity-100 sm:inline">
            Add
          </span>
        </>
      )}
    </button>
  );
}
