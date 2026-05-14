'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Check, Circle, ArrowRight } from 'lucide-react';
import { LEARNING_PATHS, type LearningPath, type LearningStep } from '@/lib/learning-paths';
import { GLOSSARY } from '@/lib/glossary';

const STORAGE_KEY = 'aitools_path_progress';

function stepKey(pathSlug: string, idx: number): string {
  return `${pathSlug}:${idx}`;
}

function stepHref(step: LearningStep): string {
  if (step.kind === 'tool') return `/tools/${step.ref}`;
  return `/glossary#term-${step.ref}`;
}

function stepLabel(step: LearningStep): string {
  if (step.kind === 'concept') {
    const term = GLOSSARY.find((g) => g.slug === step.ref);
    return term?.term ?? step.ref;
  }
  // Tool labels are not resolvable client-side without a fetch; fall back to
  // a humanized slug. The link still points at the canonical /tools page.
  return step.ref
    .split('-')
    .map((part) => (part.length ? part[0].toUpperCase() + part.slice(1) : part))
    .join(' ');
}

function loadCompleted(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((v): v is string => typeof v === 'string'));
  } catch {
    return new Set();
  }
}

function saveCompleted(set: Set<string>) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch {
    // ignore quota / private-mode errors
  }
}

export default function PathProgress() {
  const [selectedSlug, setSelectedSlug] = useState<string>(LEARNING_PATHS[0].slug);
  const [completed, setCompleted] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    setCompleted(loadCompleted());
  }, []);

  const selected: LearningPath = useMemo(() => {
    return LEARNING_PATHS.find((p) => p.slug === selectedSlug) ?? LEARNING_PATHS[0];
  }, [selectedSlug]);

  const toggle = (key: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      saveCompleted(next);
      return next;
    });
  };

  const doneCount = selected.steps.reduce(
    (acc, _step, idx) => (completed.has(stepKey(selected.slug, idx)) ? acc + 1 : acc),
    0,
  );
  const total = selected.steps.length;
  const pct = total === 0 ? 0 : Math.round((doneCount / total) * 100);

  return (
    <div className="rounded-2xl border border-line bg-surface-1 p-6 md:p-8">
      {/* Path tabs */}
      <div className="flex flex-wrap gap-2">
        {LEARNING_PATHS.map((path) => {
          const isActive = path.slug === selected.slug;
          return (
            <button
              key={path.slug}
              type="button"
              onClick={() => setSelectedSlug(path.slug)}
              className={
                isActive
                  ? 'rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white transition-colors'
                  : 'rounded-lg border border-line bg-surface-1 px-3 py-1.5 text-sm text-ink-dim transition-colors hover:bg-surface-2 hover:text-ink'
              }
              aria-pressed={isActive}
            >
              {path.title}
            </button>
          );
        })}
      </div>

      {/* Header + progress bar */}
      <div className="mt-6">
        <div className="flex items-baseline justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-xl font-medium text-ink truncate">{selected.title}</h2>
            <p className="mt-1 text-sm text-ink-dim">{selected.tagline}</p>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-2xl font-medium text-ink tabular-nums">{pct}%</div>
            <div className="text-xs text-ink-faint">
              {doneCount} / {total}
            </div>
          </div>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full bg-accent transition-[width] duration-300"
            style={{ width: `${pct}%` }}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Step checklist */}
      <ol className="mt-6 space-y-2">
        {selected.steps.map((step, idx) => {
          const key = stepKey(selected.slug, idx);
          const isDone = completed.has(key);
          const label = stepLabel(step);
          const href = stepHref(step);
          return (
            <li
              key={key}
              className="flex items-start gap-3 rounded-xl border border-line bg-surface-1 p-3 transition-colors hover:bg-surface-2"
            >
              <button
                type="button"
                onClick={() => toggle(key)}
                aria-pressed={isDone}
                aria-label={isDone ? `Mark "${label}" incomplete` : `Mark "${label}" complete`}
                className={
                  isDone
                    ? 'mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-accent bg-accent text-white transition-colors'
                    : 'mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-line-2 bg-surface-1 text-ink-faint transition-colors hover:border-accent hover:text-accent'
                }
              >
                {isDone ? (
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Circle className="h-3 w-3" aria-hidden="true" />
                )}
              </button>
              <div className="min-w-0 flex-1">
                <Link
                  href={href}
                  className={
                    isDone
                      ? 'inline-flex items-center gap-1 text-[15px] text-ink-faint line-through transition-colors hover:text-accent'
                      : 'inline-flex items-center gap-1 text-[15px] text-ink transition-colors hover:text-accent'
                  }
                >
                  {label}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  {step.kind === 'concept' ? (
                    <span className="ml-1 text-xs text-ink-faint italic">(concept)</span>
                  ) : null}
                </Link>
                <p className="mt-0.5 text-sm text-ink-dim">{step.why}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
