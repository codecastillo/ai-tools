'use client';

import { useEffect, useState } from 'react';
import { Circle, BookmarkPlus, Zap } from 'lucide-react';
import { cn } from '@/lib/cn';

type Status = 'untried' | 'want' | 'using';

const STORAGE_KEY = 'aitools_tracker';
const EVENT_NAME = 'aitools_tracker_change';

const ORDER: Status[] = ['untried', 'want', 'using'];

function readTracker(): Record<string, Status> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const out: Record<string, Status> = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof k !== 'string') continue;
      if (v === 'untried' || v === 'want' || v === 'using') {
        out[k] = v;
      }
    }
    return out;
  } catch {
    return {};
  }
}

function writeTracker(map: Record<string, Status>) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: map }));
  } catch {
    // ignore quota or serialization errors
  }
}

function nextStatus(current: Status): Status {
  const i = ORDER.indexOf(current);
  return ORDER[(i + 1) % ORDER.length];
}

interface Props {
  slug: string;
  size?: 'sm' | 'md';
  variant?: 'icon' | 'pill';
}

const LABELS: Record<Status, string> = {
  untried: 'Untried',
  want: 'Want to try',
  using: 'Using',
};

const ARIA: Record<Status, string> = {
  untried: 'Mark as want to try',
  want: 'Mark as using',
  using: 'Mark as untried',
};

export default function TrackerButton({
  slug,
  size = 'sm',
  variant = 'icon',
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<Status>('untried');

  useEffect(() => {
    setMounted(true);
    setStatus(readTracker()[slug] ?? 'untried');

    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<Record<string, Status>>).detail;
      const map =
        detail && typeof detail === 'object' && !Array.isArray(detail)
          ? detail
          : readTracker();
      setStatus(map[slug] ?? 'untried');
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setStatus(readTracker()[slug] ?? 'untried');
    };

    window.addEventListener(EVENT_NAME, onChange as EventListener);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(EVENT_NAME, onChange as EventListener);
      window.removeEventListener('storage', onStorage);
    };
  }, [slug]);

  const iconSize = size === 'md' ? 'h-4 w-4' : 'h-3.5 w-3.5';
  const buttonSize = size === 'md' ? 'h-9 w-9' : 'h-7 w-7';

  if (!mounted) {
    if (variant === 'pill') {
      return (
        <span
          aria-hidden
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md border border-line-2 bg-[--color-surface]/60 px-3 opacity-0',
            size === 'md' ? 'h-9 text-sm' : 'h-7 text-xs',
          )}
        />
      );
    }
    return (
      <span
        aria-hidden
        className={cn(
          'inline-flex items-center justify-center rounded-md border border-line-2 bg-[--color-surface]/60 opacity-0',
          buttonSize,
        )}
      />
    );
  }

  const cycle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const current = readTracker();
    const next = nextStatus(current[slug] ?? 'untried');
    const updated = { ...current };
    if (next === 'untried') {
      delete updated[slug];
    } else {
      updated[slug] = next;
    }
    writeTracker(updated);
    setStatus(next);
  };

  const iconClass = cn(
    iconSize,
    status === 'untried' && 'text-ink-faint',
    status === 'want' && 'text-accent',
    status === 'using' && 'text-success fill-success',
  );

  const Icon =
    status === 'using' ? Zap : status === 'want' ? BookmarkPlus : Circle;

  if (variant === 'pill') {
    return (
      <button
        type="button"
        aria-label={ARIA[status]}
        title={LABELS[status]}
        onClick={cycle}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-md border font-medium transition-colors',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
          size === 'md' ? 'h-9 px-3 text-sm' : 'h-7 px-2.5 text-xs',
          status === 'untried' &&
            'border-line-2 bg-[--color-surface]/80 text-ink-dim hover:border-accent/40 hover:bg-accent/10 hover:text-ink',
          status === 'want' &&
            'border-accent/40 bg-accent/10 text-accent hover:border-accent/60 hover:bg-accent/15',
          status === 'using' &&
            'border-success/40 bg-success/10 text-success hover:border-success/60 hover:bg-success/15',
        )}
      >
        <Icon className={iconClass} />
        {LABELS[status]}
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label={ARIA[status]}
      title={LABELS[status]}
      onClick={cycle}
      className={cn(
        'inline-flex items-center justify-center rounded-md border transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
        buttonSize,
        status === 'untried' &&
          'border-line-2 bg-[--color-surface]/80 backdrop-blur-sm hover:border-accent/40 hover:bg-accent/10',
        status === 'want' &&
          'border-accent/40 bg-accent/10 hover:border-accent/60 hover:bg-accent/15',
        status === 'using' &&
          'border-success/40 bg-success/10 hover:border-success/60 hover:bg-success/15',
      )}
    >
      <Icon className={iconClass} />
    </button>
  );
}
