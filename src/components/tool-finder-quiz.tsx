'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { Tool, Category, Pricing, Difficulty } from '@/lib/types';
import { categoryStyle } from '@/lib/categories';

interface Props {
  tools: Tool[];
}

type Goal = 'code' | 'chat' | 'build' | 'explore';
type Budget = 'free' | 'cheap' | 'any';
type Level = 'first' | 'some' | 'senior';

const STORAGE_KEY = 'aitools_quiz_answers';

interface QuizOption<T extends string> {
  value: T;
  label: string;
  hint?: string;
}

const Q1_OPTIONS: QuizOption<Goal>[] = [
  { value: 'code', label: 'Write code', hint: 'Terminal copilots and IDE agents' },
  { value: 'chat', label: 'Chat and research', hint: 'Conversational assistants' },
  { value: 'build', label: 'Build an AI feature', hint: 'SDKs and frameworks' },
  { value: 'explore', label: 'Just explore', hint: 'Survey the Claude ecosystem' },
];

const Q2_OPTIONS: QuizOption<Budget>[] = [
  { value: 'free', label: 'Free only', hint: 'Free tier or open source' },
  { value: 'cheap', label: 'Up to $20/mo', hint: 'Freemium plans included' },
  { value: 'any', label: 'Whatever works best', hint: 'No budget limit' },
];

const Q3_OPTIONS: QuizOption<Level>[] = [
  { value: 'first', label: 'First time', hint: 'Easy onboarding' },
  { value: 'some', label: 'Some coding', hint: 'Comfortable in a terminal' },
  { value: 'senior', label: 'Senior', hint: 'Anything goes' },
];

const GOAL_TO_CATEGORIES: Record<Goal, Category[]> = {
  code: ['clis', 'claude'],
  chat: [],
  build: [],
  explore: ['claude'],
};

const GOAL_TO_SLUGS: Record<Goal, string[]> = {
  code: [],
  chat: ['chatgpt', 'perplexity', 'notebooklm', 'claude-api'],
  build: ['vercel-ai-sdk', 'langchain', 'llamaindex', 'ai-gateway', 'claude-agent-sdk'],
  explore: [],
};

function matchesGoal(tool: Tool, goal: Goal): boolean {
  const slugs = GOAL_TO_SLUGS[goal];
  const cats = GOAL_TO_CATEGORIES[goal];
  if (slugs.length > 0 && slugs.includes(tool.slug)) return true;
  if (cats.length > 0 && tool.category && cats.includes(tool.category)) return true;
  return false;
}

const BUDGET_TO_PRICING: Record<Budget, Pricing[] | null> = {
  free: ['free', 'oss'],
  cheap: ['free', 'oss', 'freemium'],
  any: null,
};

const LEVEL_TO_DIFFICULTY: Record<Level, Difficulty[] | null> = {
  first: ['easy'],
  some: ['easy', 'medium'],
  senior: null,
};

function byPopularity(a: Tool, b: Tool) {
  return b.popularity - a.popularity;
}

function uniqBy<T, K>(arr: T[], key: (t: T) => K): T[] {
  const seen = new Set<K>();
  const out: T[] = [];
  for (const item of arr) {
    const k = key(item);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(item);
  }
  return out;
}

function recommend(tools: Tool[], goal: Goal, budget: Budget, level: Level): Tool[] {
  const pricingFilter = BUDGET_TO_PRICING[budget];
  const difficultyFilter = LEVEL_TO_DIFFICULTY[level];

  const byGoal = tools.filter((t) => matchesGoal(t, goal));
  const byPricing = (list: Tool[]) =>
    pricingFilter ? list.filter((t) => t.pricing && pricingFilter.includes(t.pricing)) : list;
  const byDifficulty = (list: Tool[]) =>
    difficultyFilter
      ? list.filter((t) => t.difficulty && difficultyFilter.includes(t.difficulty))
      : list;

  // Full filter chain
  let results = byDifficulty(byPricing(byGoal));

  // Relax difficulty
  if (results.length < 3) {
    results = byPricing(byGoal);
  }

  // Relax pricing
  if (results.length < 3) {
    results = byGoal;
  }

  // Relax goal
  if (results.length < 3) {
    results = [...tools];
  }

  results = uniqBy(results, (t) => t.id).sort(byPopularity);

  // Pad with highest popularity tools if still short
  if (results.length < 3) {
    const padPool = [...tools].sort(byPopularity);
    for (const tool of padPool) {
      if (results.length >= 3) break;
      if (!results.some((r) => r.id === tool.id)) results.push(tool);
    }
  }

  return results.slice(0, 3);
}

interface PersistedAnswers {
  q1: Goal | null;
  q2: Budget | null;
  q3: Level | null;
}

function readStoredAnswers(): PersistedAnswers | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PersistedAnswers>;
    if (!parsed || typeof parsed !== 'object') return null;
    return {
      q1: (parsed.q1 ?? null) as Goal | null,
      q2: (parsed.q2 ?? null) as Budget | null,
      q3: (parsed.q3 ?? null) as Level | null,
    };
  } catch {
    return null;
  }
}

export default function ToolFinderQuiz({ tools }: Props) {
  const [step, setStep] = useState(1);
  const [q1, setQ1] = useState<Goal | null>(null);
  const [q2, setQ2] = useState<Budget | null>(null);
  const [q3, setQ3] = useState<Level | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Restore from localStorage on mount.
  useEffect(() => {
    const stored = readStoredAnswers();
    if (stored && stored.q1 && stored.q2 && stored.q3) {
      setQ1(stored.q1);
      setQ2(stored.q2);
      setQ3(stored.q3);
      setStep(4);
    }
    setHydrated(true);
  }, []);

  // Persist completed answers.
  useEffect(() => {
    if (!hydrated) return;
    if (q1 && q2 && q3) {
      try {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ q1, q2, q3 } satisfies PersistedAnswers),
        );
      } catch {
        // ignore quota / privacy mode
      }
    }
  }, [hydrated, q1, q2, q3]);

  const handlePick1 = (v: Goal) => {
    setQ1(v);
    setStep(2);
  };
  const handlePick2 = (v: Budget) => {
    setQ2(v);
    setStep(3);
  };
  const handlePick3 = (v: Level) => {
    setQ3(v);
    setStep(4);
  };

  const handleReset = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setQ1(null);
    setQ2(null);
    setQ3(null);
    setStep(1);
  };

  const showResults = step === 4 && q1 && q2 && q3;
  const recs = showResults ? recommend(tools, q1, q2, q3) : [];

  return (
    <div className="rounded-2xl border border-line bg-surface-1 p-8 md:p-10 text-center">
      <Sparkles className="h-5 w-5 text-accent mx-auto mb-2" />
      <h2 className="text-display text-2xl md:text-3xl tracking-tight text-ink">
        Find your tool in 30 seconds
      </h2>
      <p className="mt-1 text-sm text-ink-mute">
        Three quick questions, three recommendations.
      </p>

      <StepIndicator step={showResults ? 3 : step} />

      <div key={step} className="animate-in fade-in duration-300 mt-8">
        {step === 1 && (
          <QuestionBlock
            prompt="What are you trying to do?"
            options={Q1_OPTIONS}
            onPick={handlePick1}
          />
        )}
        {step === 2 && (
          <QuestionBlock prompt="Budget?" options={Q2_OPTIONS} onPick={handlePick2} />
        )}
        {step === 3 && (
          <QuestionBlock
            prompt="Experience level?"
            options={Q3_OPTIONS}
            onPick={handlePick3}
          />
        )}
        {showResults && <Results tools={recs} onReset={handleReset} />}
      </div>
    </div>
  );
}

function StepIndicator({ step }: { step: number }) {
  const active = Math.min(Math.max(step, 1), 3);
  return (
    <div
      className="mt-6 flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-[0.18em]"
      aria-label={`Step ${active} of 3`}
    >
      {[1, 2, 3].map((n, i) => (
        <span key={n} className="flex items-center gap-2">
          <span className={n === active ? 'text-accent' : 'text-ink-faint'}>{n}</span>
          {i < 2 && <span className="text-ink-faint">·</span>}
        </span>
      ))}
    </div>
  );
}

interface QuestionBlockProps<T extends string> {
  prompt: string;
  options: QuizOption<T>[];
  onPick: (value: T) => void;
}

function QuestionBlock<T extends string>({ prompt, options, onPick }: QuestionBlockProps<T>) {
  return (
    <div>
      <p className="text-xl md:text-2xl font-medium text-ink">{prompt}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onPick(opt.value)}
            className="rounded-lg border border-line bg-surface-1 px-4 py-3 text-left hover:bg-surface-2 hover:border-line-2 transition"
          >
            <div className="text-sm font-medium text-ink">{opt.label}</div>
            {opt.hint && <div className="mt-0.5 text-xs text-ink-mute">{opt.hint}</div>}
          </button>
        ))}
      </div>
    </div>
  );
}

function Results({ tools, onReset }: { tools: Tool[]; onReset: () => void }) {
  if (tools.length === 0) {
    return (
      <div>
        <p className="text-base text-ink-mute">No matches found.</p>
        <button
          type="button"
          onClick={onReset}
          className="mt-6 text-sm text-accent hover:text-accent-bright transition-colors"
        >
          Start over
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xl md:text-2xl font-medium text-ink">Your top 3</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
        {tools.map((tool) => {
          const cat = categoryStyle(tool.category);
          return (
            <Link
              key={tool.id}
              href={`/tools/${tool.slug}`}
              className="group rounded-xl border border-line bg-surface-1 p-5 text-center hover:border-line-2 hover:bg-surface-3 transition"
            >
              <div className="text-[11px] uppercase tracking-wider text-ink-faint">
                {cat.label}
              </div>
              <div className="mt-2 text-base font-medium text-ink">{tool.title}</div>
              {tool.tagline && (
                <div className="mt-1 text-sm text-ink-mute line-clamp-2">{tool.tagline}</div>
              )}
              <div className="mt-4 inline-flex items-center gap-1 text-xs text-accent group-hover:gap-2 transition-all">
                Open guide <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          );
        })}
      </div>
      <button
        type="button"
        onClick={onReset}
        className="mt-8 text-sm text-ink-mute hover:text-ink transition-colors"
      >
        Start over
      </button>
    </div>
  );
}
