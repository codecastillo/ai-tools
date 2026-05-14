'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Check,
  X,
  ArrowRight,
  Play,
  RotateCcw,
  Trophy,
  Star,
  Sparkles,
  BookOpen,
  Wrench,
  DollarSign,
  Brain,
} from 'lucide-react';
import { QUIZ_QUESTIONS, type QuizQuestion } from '@/lib/quiz-questions';

type Phase = 'idle' | 'playing' | 'done';

const QUESTIONS_PER_SESSION = 10;
const BEST_KEY = 'aitools_quiz_best';

function shuffle<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pickQuestions(): QuizQuestion[] {
  return shuffle(QUIZ_QUESTIONS).slice(0, QUESTIONS_PER_SESSION);
}

function sourceLabel(source: QuizQuestion['source']) {
  switch (source) {
    case 'glossary':
      return { label: 'Glossary', Icon: BookOpen };
    case 'tools':
      return { label: 'Tools', Icon: Wrench };
    case 'pricing':
      return { label: 'Pricing', Icon: DollarSign };
    case 'general':
      return { label: 'General', Icon: Brain };
  }
}

export default function QuizGame() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [bestScore, setBestScore] = useState(0);
  const [newBest, setNewBest] = useState(false);

  // Load best score from localStorage on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(BEST_KEY);
      if (raw) {
        const n = Number.parseInt(raw, 10);
        if (Number.isFinite(n) && n >= 0 && n <= QUESTIONS_PER_SESSION) {
          setBestScore(n);
        }
      }
    } catch {
      // Ignore storage errors (private mode, etc).
    }
  }, []);

  const current = questions[index];
  const selected = answers[index];
  const hasAnswered = selected !== undefined && selected !== -1;
  const isLast = index === questions.length - 1;

  const score = useMemo(() => {
    if (questions.length === 0) return 0;
    return answers.reduce((acc, picked, i) => {
      if (picked === questions[i]?.answer) return acc + 1;
      return acc;
    }, 0);
  }, [answers, questions]);

  function handleStart() {
    const next = pickQuestions();
    setQuestions(next);
    setIndex(0);
    setAnswers(new Array(next.length).fill(-1));
    setNewBest(false);
    setPhase('playing');
  }

  function handlePick(choiceIndex: number) {
    if (hasAnswered) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = choiceIndex;
      return next;
    });
  }

  function handleNext() {
    if (!hasAnswered) return;
    if (isLast) {
      // Finalize: compute score against the just-updated answers.
      const finalScore = answers.reduce((acc, picked, i) => {
        if (picked === questions[i]?.answer) return acc + 1;
        return acc;
      }, 0);
      if (finalScore > bestScore) {
        setBestScore(finalScore);
        setNewBest(true);
        try {
          window.localStorage.setItem(BEST_KEY, String(finalScore));
        } catch {
          // Ignore.
        }
      }
      setPhase('done');
      return;
    }
    setIndex((i) => i + 1);
  }

  if (phase === 'idle') {
    return (
      <div className="rounded-2xl border border-line bg-surface-1 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-line bg-surface-2">
          <Sparkles className="h-6 w-6 text-accent" />
        </div>
        <h2 className="mt-5 text-2xl font-medium text-ink">Ready?</h2>
        <p className="mt-2 text-sm text-ink-dim">
          Ten questions, four choices each. No timer. Pick the best answer.
        </p>

        <button
          type="button"
          onClick={handleStart}
          className="mt-7 inline-flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-5 py-2.5 text-sm font-medium text-ink hover:bg-accent/15"
        >
          <Play className="h-4 w-4" />
          Start quiz
        </button>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-ink-mute">
          <Trophy className="h-3.5 w-3.5 text-accent-2" />
          <span>
            Best score:{' '}
            <span className="font-mono text-ink-dim">
              {bestScore} / {QUESTIONS_PER_SESSION}
            </span>
          </span>
        </div>
      </div>
    );
  }

  if (phase === 'playing' && current) {
    const progress = ((index + (hasAnswered ? 1 : 0)) / questions.length) * 100;
    const { label: sLabel, Icon: SIcon } = sourceLabel(current.source);

    return (
      <div className="rounded-2xl border border-line bg-surface-1 p-6 md:p-8">
        {/* Header: counter, source, progress */}
        <div className="flex items-center justify-between text-xs text-ink-mute">
          <span className="font-mono">
            Question {index + 1} of {questions.length}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-2 py-0.5">
            <SIcon className="h-3 w-3" />
            {sLabel}
          </span>
        </div>

        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full bg-accent transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Prompt */}
        <h2 className="mt-7 text-xl text-ink md:text-2xl">
          {current.prompt}
        </h2>

        {/* Choices */}
        <div className="mt-5 grid gap-2.5">
          {current.choices.map((choice, i) => {
            const isCorrect = i === current.answer;
            const isSelected = selected === i;

            let cls =
              'border-line bg-surface-1 hover:bg-surface-2 text-ink-dim';
            if (hasAnswered) {
              if (isSelected && isCorrect) {
                cls = 'border-success/40 bg-success/10 text-ink';
              } else if (isSelected && !isCorrect) {
                cls = 'border-red-400/40 bg-red-400/10 text-ink';
              } else if (isCorrect) {
                cls = 'border-success/40 bg-success/5 text-ink-dim';
              } else {
                cls = 'border-line bg-surface-1 text-ink-mute opacity-70';
              }
            } else if (isSelected) {
              cls = 'border-line-2 bg-surface-2 text-ink';
            }

            return (
              <button
                key={i}
                type="button"
                onClick={() => handlePick(i)}
                disabled={hasAnswered}
                className={`group flex items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${cls} disabled:cursor-default`}
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-line bg-surface-2 font-mono text-[11px] text-ink-mute">
                  {hasAnswered && isCorrect ? (
                    <Check className="h-3.5 w-3.5 text-success" />
                  ) : hasAnswered && isSelected && !isCorrect ? (
                    <X className="h-3.5 w-3.5 text-red-400" />
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </span>
                <span className="leading-relaxed">{choice}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback + next */}
        {hasAnswered && (
          <div className="mt-6 animate-in fade-in">
            <div
              className={`rounded-xl border px-4 py-3 text-sm ${
                selected === current.answer
                  ? 'border-success/40 bg-success/10 text-ink'
                  : 'border-red-400/40 bg-red-400/10 text-ink'
              }`}
            >
              <div className="flex items-center gap-2 font-medium">
                {selected === current.answer ? (
                  <>
                    <Check className="h-4 w-4 text-success" />
                    Correct
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4 text-red-400" />
                    Not quite
                  </>
                )}
              </div>
              {current.explainer && (
                <p className="mt-1.5 text-ink-dim">{current.explainer}</p>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-medium text-ink hover:bg-accent/15"
              >
                {isLast ? 'See results' : 'Next question'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Done phase
  const correctCount = score;
  const wrongCount = questions.length - correctCount;
  const pct = Math.round((correctCount / questions.length) * 100);

  return (
    <div className="rounded-2xl border border-line bg-surface-1 p-6 md:p-8">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-line bg-surface-2">
          <Trophy className="h-6 w-6 text-accent-2" />
        </div>
        <h2 className="mt-5 text-2xl font-medium text-ink">
          {correctCount} / {questions.length}
        </h2>
        <p className="mt-1 text-sm text-ink-dim">
          You scored {pct}%
          {newBest && (
            <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-accent-2/40 bg-accent-2/10 px-2 py-0.5 text-xs font-medium text-ink">
              <Star className="h-3 w-3 text-accent-2" />
              New best
            </span>
          )}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-success/30 bg-success/5 px-4 py-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs uppercase tracking-wide text-ink-mute">
            <Check className="h-3.5 w-3.5 text-success" />
            Correct
          </div>
          <div className="mt-1 font-mono text-2xl text-ink">{correctCount}</div>
        </div>
        <div className="rounded-xl border border-red-400/30 bg-red-400/5 px-4 py-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs uppercase tracking-wide text-ink-mute">
            <X className="h-3.5 w-3.5 text-red-400" />
            Wrong
          </div>
          <div className="mt-1 font-mono text-2xl text-ink">{wrongCount}</div>
        </div>
      </div>

      {/* Per-question recap */}
      <ul className="mt-6 divide-y divide-[var(--color-line)] overflow-hidden rounded-xl border border-line">
        {questions.map((q, i) => {
          const picked = answers[i];
          const isRight = picked === q.answer;
          return (
            <li
              key={q.id}
              className="flex items-start gap-3 bg-surface-1 px-4 py-3 text-sm"
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${
                  isRight
                    ? 'bg-success/15 text-success'
                    : 'bg-red-400/15 text-red-400'
                }`}
              >
                {isRight ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <X className="h-3 w-3" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-ink">{q.prompt}</div>
                {!isRight && (
                  <div className="mt-0.5 text-xs text-ink-mute">
                    Answer:{' '}
                    <span className="text-ink-dim">{q.choices[q.answer]}</span>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <div className="inline-flex items-center gap-2 text-xs text-ink-mute">
          <Trophy className="h-3.5 w-3.5 text-accent-2" />
          Best:{' '}
          <span className="font-mono text-ink-dim">
            {bestScore} / {QUESTIONS_PER_SESSION}
          </span>
        </div>
        <button
          type="button"
          onClick={handleStart}
          className="inline-flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-medium text-ink hover:bg-accent/15"
        >
          <RotateCcw className="h-4 w-4" />
          Play again
        </button>
      </div>
    </div>
  );
}
