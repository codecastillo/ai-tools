'use client';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { GLOSSARY } from '@/lib/glossary';
import { Shuffle, ArrowLeft, ArrowRight, RotateCcw, Check } from 'lucide-react';

const STORAGE_KEY = 'aitools_flashcards_known';

function shuffle(n: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function categoryFor(slug: string, term: string): string {
  const first = term.charAt(0).toUpperCase();
  const letter = /[A-Z]/.test(first) ? first : '#';
  return `Glossary term, ${letter}`;
}

export default function GlossaryFlashcards() {
  const total = GLOSSARY.length;
  const [order, setOrder] = useState<number[]>(() => Array.from({ length: total }, (_, i) => i));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setSeen(new Set(parsed.filter((x): x is string => typeof x === 'string')));
        }
      }
    } catch {
      // Ignore corrupt storage.
    }
    setOrder(shuffle(total));
    setHydrated(true);
  }, [total]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(seen)));
    } catch {
      // Storage may be unavailable (private mode, etc).
    }
  }, [seen, hydrated]);

  const atEnd = index >= order.length;
  const currentTerm = useMemo(() => {
    if (atEnd) return null;
    const i = order[index];
    return GLOSSARY[i] ?? null;
  }, [atEnd, index, order]);

  const reshuffle = useCallback(() => {
    setOrder(shuffle(total));
    setIndex(0);
    setFlipped(false);
  }, [total]);

  const prev = useCallback(() => {
    setFlipped(false);
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const next = useCallback(() => {
    setFlipped(false);
    setIndex((i) => Math.min(order.length, i + 1));
  }, [order.length]);

  const flip = useCallback(() => {
    if (atEnd) return;
    setFlipped((f) => !f);
  }, [atEnd]);

  const markKnown = useCallback(() => {
    if (!currentTerm) return;
    setSeen((prevSeen) => {
      const nextSet = new Set(prevSeen);
      nextSet.add(currentTerm.slug);
      return nextSet;
    });
    // Auto-advance after marking.
    setFlipped(false);
    setIndex((i) => Math.min(order.length, i + 1));
  }, [currentTerm, order.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) {
          return;
        }
      }
      switch (e.key) {
        case ' ':
        case 'Spacebar':
          e.preventDefault();
          flip();
          break;
        case 'ArrowLeft':
        case 'j':
        case 'J':
          e.preventDefault();
          prev();
          break;
        case 'ArrowRight':
        case 'k':
        case 'K':
          e.preventDefault();
          next();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          reshuffle();
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          markKnown();
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flip, prev, next, reshuffle, markKnown]);

  const knownCount = seen.size;
  const positionLabel = atEnd
    ? `${order.length} of ${order.length}`
    : `${index + 1} of ${order.length}`;

  return (
    <div className="mx-auto flex min-h-[480px] w-full max-w-[480px] flex-col items-center justify-center">
      <div className="mb-4 text-center text-sm text-ink-faint">
        Card {positionLabel} <span className="mx-1.5 text-ink-faint/60">|</span> {knownCount} marked known
      </div>

      {atEnd ? (
        <div className="w-full rounded-2xl border border-line bg-surface-1 p-8 text-center shadow-sm md:p-12">
          <h2 className="text-2xl font-medium text-ink">You have seen all cards.</h2>
          <p className="mt-3 text-ink-dim">
            {knownCount} marked known. Reshuffle to go again.
          </p>
          <button
            type="button"
            onClick={reshuffle}
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-line bg-surface-2 px-4 py-2 text-sm text-ink transition-colors hover:border-accent/40 hover:text-accent"
          >
            <Shuffle className="h-4 w-4" aria-hidden="true" />
            Reshuffle
          </button>
        </div>
      ) : currentTerm ? (
        <>
          <div
            className="group relative w-full cursor-pointer select-none [perspective:1200px]"
            style={{ minHeight: 280 }}
            onClick={flip}
            role="button"
            tabIndex={0}
            aria-label={flipped ? 'Show term' : 'Reveal definition'}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                flip();
              }
            }}
          >
            <div
              className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]"
              style={{
                minHeight: 280,
                transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* Front */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-line bg-surface-1 p-8 text-center shadow-sm md:p-12 [backface-visibility:hidden] [-webkit-backface-visibility:hidden]"
                style={{ minHeight: 280 }}
              >
                <div className="text-xs uppercase tracking-wider text-ink-faint">
                  {categoryFor(currentTerm.slug, currentTerm.term)}
                </div>
                <div className="mt-4 text-3xl font-medium text-ink md:text-4xl">
                  {currentTerm.term}
                </div>
                {seen.has(currentTerm.slug) ? (
                  <div className="mt-3 inline-flex items-center gap-1 text-xs text-accent">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    Known
                  </div>
                ) : null}
                <div className="mt-6 text-xs text-ink-faint">Press space to flip</div>
              </div>

              {/* Back */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-line bg-surface-1 p-8 text-center shadow-sm md:p-12 [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)]"
                style={{ minHeight: 280 }}
              >
                <div className="text-base font-medium text-ink md:text-lg">
                  {currentTerm.short}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ink-dim md:text-[15px]">
                  {currentTerm.long}
                </p>
                <div className="mt-6 text-xs text-ink-faint">Press space to flip back</div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={prev}
              disabled={index === 0}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface-1 px-3 py-2 text-sm text-ink-dim transition-colors hover:border-line-2 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous card"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Prev
            </button>
            <button
              type="button"
              onClick={flip}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm text-ink transition-colors hover:border-accent/40 hover:text-accent"
              aria-label="Flip card"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Flip
            </button>
            <button
              type="button"
              onClick={markKnown}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface-1 px-3 py-2 text-sm text-ink-dim transition-colors hover:border-accent/40 hover:text-accent"
              aria-label="Mark current card as known"
            >
              <Check className="h-4 w-4" aria-hidden="true" />
              Mark known
            </button>
            <button
              type="button"
              onClick={next}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface-1 px-3 py-2 text-sm text-ink-dim transition-colors hover:border-line-2 hover:text-ink"
              aria-label="Next card"
            >
              Next
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={reshuffle}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface-1 px-3 py-2 text-sm text-ink-dim transition-colors hover:border-accent/40 hover:text-accent"
              aria-label="Reshuffle deck"
            >
              <Shuffle className="h-4 w-4" aria-hidden="true" />
              Shuffle
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
