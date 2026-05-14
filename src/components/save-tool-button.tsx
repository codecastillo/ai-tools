'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/cn';

const STORAGE_KEY = 'aitools_saved';
const EVENT_NAME = 'aitools_saved_change';

function readSaved(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((s): s is string => typeof s === 'string');
  } catch {
    return [];
  }
}

function writeSaved(slugs: string[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: slugs }));
  } catch {
    // ignore quota or serialization errors
  }
}

interface Props {
  slug: string;
  size?: 'sm' | 'md';
  variant?: 'icon' | 'pill';
}

export default function SaveToolButton({
  slug,
  size = 'sm',
  variant = 'icon',
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSaved(readSaved().includes(slug));

    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<string[]>).detail;
      const list = Array.isArray(detail) ? detail : readSaved();
      setSaved(list.includes(slug));
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setSaved(readSaved().includes(slug));
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

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const current = readSaved();
    const next = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    writeSaved(next);
    setSaved(next.includes(slug));
  };

  if (variant === 'pill') {
    return (
      <button
        type="button"
        aria-pressed={saved}
        aria-label={saved ? 'Remove from saved tools' : 'Save tool'}
        title={saved ? 'Saved' : 'Save'}
        onClick={toggle}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-md border font-medium transition-colors',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
          size === 'md' ? 'h-9 px-3 text-sm' : 'h-7 px-2.5 text-xs',
          saved
            ? 'border-amber-400/40 bg-amber-400/10 text-amber-300 hover:border-amber-400/60 hover:bg-amber-400/15'
            : 'border-line-2 bg-[--color-surface]/80 text-ink-dim hover:border-accent/40 hover:bg-accent/10 hover:text-ink',
        )}
      >
        <Star
          className={cn(iconSize, saved ? 'fill-amber-400 text-amber-400' : 'text-ink-faint')}
        />
        {saved ? 'Saved' : 'Save'}
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? 'Remove from saved tools' : 'Save tool'}
      title={saved ? 'Saved' : 'Save'}
      onClick={toggle}
      className={cn(
        'inline-flex items-center justify-center rounded-md border transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
        buttonSize,
        saved
          ? 'border-amber-400/40 bg-amber-400/10 hover:border-amber-400/60 hover:bg-amber-400/15'
          : 'border-line-2 bg-[--color-surface]/80 backdrop-blur-sm hover:border-accent/40 hover:bg-accent/10',
      )}
    >
      <Star
        className={cn(iconSize, saved ? 'fill-amber-400 text-amber-400' : 'text-ink-faint')}
      />
    </button>
  );
}
