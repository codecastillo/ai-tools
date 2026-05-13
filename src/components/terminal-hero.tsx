'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import type { Tool } from '@/lib/types';

export interface TerminalHeroProps {
  tools: Tool[];
}

/** Slugs of the tools we want to cycle through, in order. */
const CYCLE_SLUGS = [
  'claude-code',
  'cursor',
  'vercel-ai-sdk',
  'aider',
] as const;

const TYPE_SPEED_MS = 30;
const LINE_STAGGER_MS = 200;
const HOLD_MS = 2000;
const CLEAR_MS = 200;
const TAGLINE_CAP = 80;

interface CycleEntry {
  tool: Tool;
  command: string;
  taglineLine: string;
  installLine: string;
  verifiedLine: string;
}

/**
 * Extracts the first command from an `install_md` blob. Looks for the first
 * fenced ```bash block, strips any `:::os <key>` wrappers, and returns the
 * first non-empty line. Falls back to the tool URL if nothing usable found.
 */
function extractInstallCommand(tool: Tool): string {
  const md = tool.install_md ?? '';
  if (md) {
    // Match the first ```bash ... ``` (also accept "sh", "shell", "zsh").
    const fenceMatch = md.match(/```(?:bash|sh|shell|zsh)\s*\n([\s\S]*?)```/i);
    if (fenceMatch) {
      const body = fenceMatch[1] ?? '';
      const lines = body
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0 && !l.startsWith(':::') && !l.startsWith('#'));
      if (lines.length > 0) return lines[0];
    }
  }
  return tool.url;
}

function clip(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, Math.max(0, max - 1)).trimEnd() + '…';
}

function buildEntry(tool: Tool): CycleEntry {
  const tagSource = tool.tagline ?? tool.description ?? '';
  const tagline = clip(tagSource, TAGLINE_CAP);
  const verifiedDate = tool.last_verified ?? tool.approved_at ?? null;
  const verifiedLabel = tool.last_verified ? 'verified' : 'approved';
  const dateSlice = verifiedDate ? verifiedDate.slice(0, 10) : '';
  return {
    tool,
    command: `$ ai.tools install ${tool.slug}`,
    taglineLine: tagline ? `${tool.title} · ${tagline}` : tool.title,
    installLine: extractInstallCommand(tool),
    verifiedLine: dateSlice ? `${verifiedLabel} ${dateSlice}` : '',
  };
}

type Phase = 'typing' | 'reveal' | 'hold' | 'clear';

interface AnimState {
  step: number;
  phase: Phase;
  /** How many chars of the command line have been typed. */
  typedChars: number;
  /** How many of the 3 ↳ lines are currently visible (0..3). */
  revealedLines: number;
  /** Set true if reduced-motion is preferred (snaps to static). */
  reducedMotion: boolean;
}

export default function TerminalHero({ tools }: TerminalHeroProps) {
  // Build the cycle, skipping any missing slugs silently.
  const entries = useMemo<CycleEntry[]>(() => {
    const bySlug = new Map(tools.map((t) => [t.slug, t]));
    const found: CycleEntry[] = [];
    for (const slug of CYCLE_SLUGS) {
      const tool = bySlug.get(slug);
      if (tool) found.push(buildEntry(tool));
    }
    return found;
  }, [tools]);

  const [state, setState] = useState<AnimState>({
    step: 0,
    phase: 'typing',
    typedChars: 0,
    revealedLines: 0,
    reducedMotion: false,
  });

  // Track pending timers so we can clean them up on unmount / state changes.
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const clearAllTimers = () => {
    for (const t of timersRef.current) clearTimeout(t);
    timersRef.current = [];
  };

  // Detect reduced-motion preference on mount and freeze to static if so.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setState((s) => ({
        ...s,
        reducedMotion: true,
        phase: 'hold',
        typedChars: entries[0]?.command.length ?? 0,
        revealedLines: 3,
      }));
    }
    // We only check once at mount on purpose. Switching preferences mid-session
    // can keep the current frame — no flicker.
  }, [entries]);

  // The animation engine. Re-runs when step / phase / entries change.
  useEffect(() => {
    if (entries.length === 0) return;
    if (state.reducedMotion) return;

    const entry = entries[state.step % entries.length];
    clearAllTimers();

    if (state.phase === 'typing') {
      if (state.typedChars < entry.command.length) {
        const t = setTimeout(() => {
          setState((s) => ({ ...s, typedChars: s.typedChars + 1 }));
        }, TYPE_SPEED_MS);
        timersRef.current.push(t);
      } else {
        // Move to reveal phase after a brief beat.
        const t = setTimeout(() => {
          setState((s) => ({ ...s, phase: 'reveal', revealedLines: 0 }));
        }, LINE_STAGGER_MS);
        timersRef.current.push(t);
      }
      return;
    }

    if (state.phase === 'reveal') {
      if (state.revealedLines < 3) {
        const t = setTimeout(() => {
          setState((s) => ({ ...s, revealedLines: s.revealedLines + 1 }));
        }, LINE_STAGGER_MS);
        timersRef.current.push(t);
      } else {
        const t = setTimeout(() => {
          setState((s) => ({ ...s, phase: 'hold' }));
        }, HOLD_MS);
        timersRef.current.push(t);
      }
      return;
    }

    if (state.phase === 'hold') {
      const t = setTimeout(() => {
        setState((s) => ({ ...s, phase: 'clear' }));
      }, CLEAR_MS);
      timersRef.current.push(t);
      return;
    }

    if (state.phase === 'clear') {
      const t = setTimeout(() => {
        setState((s) => ({
          step: (s.step + 1) % entries.length,
          phase: 'typing',
          typedChars: 0,
          revealedLines: 0,
          reducedMotion: false,
        }));
      }, CLEAR_MS);
      timersRef.current.push(t);
      return;
    }
  }, [entries, state.step, state.phase, state.typedChars, state.revealedLines, state.reducedMotion]);

  // Final cleanup.
  useEffect(() => {
    return () => clearAllTimers();
  }, []);

  if (entries.length === 0) return null;

  const entry = entries[state.step % entries.length];
  const isClearing = state.phase === 'clear';
  const typedSoFar = state.reducedMotion
    ? entry.command
    : entry.command.slice(0, state.typedChars);
  const isFullyTyped = state.reducedMotion || state.typedChars >= entry.command.length;
  const linesToShow = state.reducedMotion ? 3 : state.revealedLines;

  // Split the typed command so we can color the `$` prompt separately.
  const promptPrefix = typedSoFar.startsWith('$ ') ? '$ ' : '';
  const promptRest = promptPrefix ? typedSoFar.slice(2) : typedSoFar;

  return (
    <div
      className={cn(
        'w-full rounded-2xl border-2 border-white/[0.08]',
        'bg-[#14121C]/95 shadow-elevated overflow-hidden',
        'backdrop-blur-sm',
      )}
    >
      {/* macOS-style chrome bar */}
      <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
          <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
          <span className="h-3 w-3 rounded-full bg-[#28C840]" />
        </div>
        <div className="flex-1" />
        <span className="font-mono text-[11px] text-ink-faint tracking-tight">
          ai.tools/install
        </span>
      </div>

      {/* Body */}
      <div
        className={cn(
          'font-mono text-[14px] sm:text-[15px] leading-relaxed p-6 sm:p-8',
          'transition-opacity duration-200',
          isClearing ? 'opacity-0' : 'opacity-100',
        )}
        // aria-live so screen readers announce updates as the cycle moves,
        // but politely so we don't spam.
        aria-live="polite"
        aria-atomic="true"
      >
        {/* Command line */}
        <div className="flex items-baseline whitespace-pre overflow-hidden">
          <span className="text-accent font-semibold">{promptPrefix}</span>
          <span className="text-ink truncate">{promptRest}</span>
          {!isFullyTyped && (
            <span
              aria-hidden="true"
              className="inline-block w-2 h-[1em] bg-accent translate-y-0.5 ml-0.5 terminal-cursor"
            />
          )}
        </div>

        {/* Tagline line */}
        <div
          className={cn(
            'mt-3 flex items-baseline gap-2 transition-opacity duration-150',
            linesToShow >= 1 ? 'opacity-100' : 'opacity-0',
          )}
        >
          <span className="text-ink-faint shrink-0">↳</span>
          <span className="text-ink-dim truncate">
            <span className="text-ink font-medium">{entry.tool.title}</span>
            {entry.taglineLine.includes('·') && (
              <span className="text-ink-mute">
                {' '}
                ·{' '}
                {entry.taglineLine.slice(entry.taglineLine.indexOf('·') + 1).trim()}
              </span>
            )}
          </span>
        </div>

        {/* Install snippet line */}
        <div
          className={cn(
            'mt-1.5 flex items-baseline gap-2 transition-opacity duration-150',
            linesToShow >= 2 ? 'opacity-100' : 'opacity-0',
          )}
        >
          <span className="text-ink-faint shrink-0">↳</span>
          <span className="text-accent-2 truncate">{entry.installLine}</span>
        </div>

        {/* Verified / approved date — hidden on <sm to save room */}
        <div
          className={cn(
            'mt-1.5 hidden sm:flex items-baseline gap-2 transition-opacity duration-150',
            linesToShow >= 3 && entry.verifiedLine ? 'opacity-100' : 'opacity-0',
          )}
        >
          <span className="text-ink-faint shrink-0">↳</span>
          <span className="text-ink-mute truncate">{entry.verifiedLine}</span>
        </div>
      </div>
    </div>
  );
}
