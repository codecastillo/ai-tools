'use client';
import { useEffect, useState } from 'react';
import { X, ArrowRight, Sparkles, Search, Command, BookOpen } from 'lucide-react';
import Link from 'next/link';

const STORAGE_KEY = 'aitools_tour_done';

export default function OnboardingTour() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const done = window.localStorage.getItem(STORAGE_KEY);
      if (done !== 'true') setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    try {
      window.localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // ignore storage failures (private mode, quotas)
    }
    setVisible(false);
  }

  function next() {
    if (step === 4) {
      dismiss();
      return;
    }
    setStep((s) => (s + 1) as 1 | 2 | 3 | 4);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Onboarding tour"
      className="fixed bottom-6 right-6 z-50 w-80 max-w-[calc(100vw-3rem)] rounded-2xl border border-line-2 bg-[#0e0a08] p-5 shadow-xl"
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss tour"
        className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-md text-ink-mute hover:bg-surface-3 hover:text-ink transition"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="text-[11px] uppercase tracking-wider text-ink-faint">
        Step {step} of 4
      </div>

      {step === 1 && (
        <div className="mt-3">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="mt-3 text-base font-medium text-ink">Welcome to ai.tools</h3>
          <p className="mt-1.5 text-sm text-ink-mute">
            A reference site for AI dev tooling. Take 30 seconds to find your bearings.
          </p>
        </div>
      )}

      {step === 2 && (
        <div className="mt-3">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
            <Search className="h-5 w-5" />
          </div>
          <h3 className="mt-3 text-base font-medium text-ink">Find your tool</h3>
          <p className="mt-1.5 text-sm text-ink-mute">
            Three questions, three recommendations.{' '}
            <Link
              href="/#find-your-tool"
              className="text-accent underline-offset-2 hover:underline"
            >
              Try it
            </Link>
            .
          </p>
        </div>
      )}

      {step === 3 && (
        <div className="mt-3">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
            <Command className="h-5 w-5" />
          </div>
          <h3 className="mt-3 text-base font-medium text-ink">Search anywhere</h3>
          <p className="mt-1.5 text-sm text-ink-mute">
            Press cmd-K from any page to fuzzy search tools, prompts, glossary, and pages.
          </p>
        </div>
      )}

      {step === 4 && (
        <div className="mt-3">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
            <BookOpen className="h-5 w-5" />
          </div>
          <h3 className="mt-3 text-base font-medium text-ink">Go deeper</h3>
          <p className="mt-1.5 text-sm text-ink-mute">
            Learning paths, a glossary, prompt library, recipes, benchmarks. Explore from the
            header.
          </p>
        </div>
      )}

      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-1.5" aria-hidden>
          {[1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full transition ${
                i === step ? 'bg-accent' : 'bg-surface-3'
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={next}
          className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-[#0e0a08] hover:bg-accent-bright transition"
        >
          {step === 4 ? 'Get started' : 'Next'}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
