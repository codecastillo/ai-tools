'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Tool } from '@/lib/types';
import { cn } from '@/lib/cn';

export interface HoverPreviewProps {
  tool: Tool;
  children: ReactNode;
}

const HOVER_DELAY_MS = 500;

/**
 * Extract the first fenced code block body from a markdown string.
 * Returns up to 3 lines, trimmed, suitable for a tiny preview.
 */
function firstInstallSnippet(md: string | null): string | null {
  if (!md) return null;
  const fence = md.match(/```[a-zA-Z0-9_-]*\n([\s\S]*?)```/);
  if (!fence || !fence[1]) return null;
  const lines = fence[1]
    .split('\n')
    .map((l) => l.trimEnd())
    .filter((l, i, arr) => !(i === arr.length - 1 && l.trim() === ''));
  return lines.slice(0, 3).join('\n');
}

function isCoarsePointer(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: coarse)').matches;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Desktop-only hover popover for tool cards. After ~500ms of hover the
 * popover fades in below its trigger and shows the tool's tagline plus
 * the first install snippet from the tool's `install_md` field.
 *
 * On coarse-pointer devices (touch) the component renders children only.
 */
export default function HoverPreview({ tool, children }: HoverPreviewProps) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [coarse, setCoarse] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
    setReduced(prefersReducedMotion());
    setCoarse(isCoarsePointer());
  }, []);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  // On coarse-pointer devices, render the trigger only.
  if (mounted && coarse) {
    return <>{children}</>;
  }

  const snippet = firstInstallSnippet(tool.install_md);

  function handleEnter() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), HOVER_DELAY_MS);
  }

  function handleLeave() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setOpen(false);
  }

  return (
    <span
      className="relative block h-full"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          aria-hidden={!open}
          className={cn(
            'pointer-events-none absolute z-30 top-full left-0 mt-2',
            'w-80 max-w-[calc(100vw-2rem)]',
            'surface block rounded-2xl border-[1.5px] border-white/[0.15] p-4',
            'shadow-[0_0_40px_-8px_var(--color-accent-glow)]',
            reduced
              ? 'opacity-100'
              : 'opacity-100 translate-y-0 transition duration-200 ease-out',
          )}
          style={{ background: 'var(--color-bg-elevated)' }}
        >
          {tool.tagline && (
            <span className="block text-sm text-ink-dim">{tool.tagline}</span>
          )}
          {snippet && (
            <span
              className={cn(
                'mt-3 block rounded-lg border border-white/[0.10] bg-black/40',
                'px-3 py-2 font-mono text-[12px] leading-relaxed text-ink',
                'overflow-hidden whitespace-pre',
              )}
              style={{ maxHeight: '4.5rem' }}
            >
              {snippet}
            </span>
          )}
          <span className="mt-3 block text-[12px] font-medium text-accent">
            Read full guide →
          </span>
        </span>
      )}
    </span>
  );
}
