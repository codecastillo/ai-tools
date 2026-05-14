'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee, Zap } from 'lucide-react';

const WORK_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;
const CYCLES_KEY = 'aitools_pomodoro_cycles';

type Phase = 'work' | 'break';

interface StoredCycles {
  date: string;
  count: number;
}

function todayStamp(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadCycles(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = window.localStorage.getItem(CYCLES_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as StoredCycles;
    if (parsed.date !== todayStamp()) return 0;
    return Math.max(0, Math.floor(parsed.count));
  } catch {
    return 0;
  }
}

function saveCycles(count: number) {
  if (typeof window === 'undefined') return;
  try {
    const payload: StoredCycles = { date: todayStamp(), count };
    window.localStorage.setItem(CYCLES_KEY, JSON.stringify(payload));
  } catch {
    // ignore quota / private-mode errors
  }
}

function formatTime(total: number): string {
  const safe = Math.max(0, Math.floor(total));
  const m = Math.floor(safe / 60).toString().padStart(2, '0');
  const s = (safe % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function notify(title: string, body: string) {
  if (typeof window === 'undefined') return;
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;
  try {
    new Notification(title, { body });
  } catch {
    // some browsers throw if the API is gated to service workers
  }
}

export default function Pomodoro() {
  const [phase, setPhase] = useState<Phase>('work');
  const [seconds, setSeconds] = useState<number>(WORK_SECONDS);
  const [running, setRunning] = useState<boolean>(false);
  const [cycles, setCycles] = useState<number>(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Hydrate cycles from storage once mounted.
  useEffect(() => {
    setCycles(loadCycles());
  }, []);

  // Ask once for notification permission when the user first hits play.
  useEffect(() => {
    if (!running) return;
    if (typeof window === 'undefined') return;
    if (!('Notification' in window)) return;
    if (Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  }, [running]);

  const advancePhase = useCallback(() => {
    setPhase((prev) => {
      const next: Phase = prev === 'work' ? 'break' : 'work';
      if (prev === 'work') {
        setCycles((c) => {
          const updated = c + 1;
          saveCycles(updated);
          return updated;
        });
        notify('Break time', 'Nice work. Take 5 minutes.');
      } else {
        notify('Back to work', 'Break over. Lock in for 25.');
      }
      setSeconds(next === 'work' ? WORK_SECONDS : BREAK_SECONDS);
      return next;
    });
  }, []);

  // Tick loop. We intentionally use setInterval rather than rAF since one
  // second resolution is plenty and rAF pauses in background tabs.
  useEffect(() => {
    if (!running) return;
    tickRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          // schedule the phase flip outside the setState callback so React
          // does not warn about updating a different component mid-render.
          queueMicrotask(advancePhase);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      tickRef.current = null;
    };
  }, [running, advancePhase]);

  const toggle = () => setRunning((r) => !r);

  const reset = () => {
    setRunning(false);
    setPhase('work');
    setSeconds(WORK_SECONDS);
  };

  const skip = () => {
    advancePhase();
  };

  const total = phase === 'work' ? WORK_SECONDS : BREAK_SECONDS;
  const progress = 1 - seconds / total;
  const phaseColor = phase === 'work' ? 'var(--color-accent)' : 'var(--color-success)';
  const phaseLabel = phase === 'work' ? 'Work' : 'Break';
  const PhaseIcon = phase === 'work' ? Zap : Coffee;

  // SVG progress ring math. Stroke offset = circumference * (1 - progress).
  const radius = 92;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="rounded-2xl border border-line bg-surface-1 p-8 md:p-12 text-center max-w-md mx-auto">
      <div
        className="inline-flex items-center gap-2 text-xs uppercase tracking-wider"
        style={{ color: phaseColor }}
      >
        <PhaseIcon className="h-3.5 w-3.5" aria-hidden="true" />
        {phaseLabel}
      </div>

      <div className="relative mt-6 mx-auto" style={{ width: 220, height: 220 }}>
        <svg
          viewBox="0 0 220 220"
          className="absolute inset-0 -rotate-90"
          aria-hidden="true"
        >
          <circle
            cx="110"
            cy="110"
            r={radius}
            fill="none"
            stroke="var(--color-line)"
            strokeWidth="6"
          />
          <circle
            cx="110"
            cy="110"
            r={radius}
            fill="none"
            stroke={phaseColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 0.4s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl md:text-7xl font-mono text-ink tabular-nums">
            {formatTime(seconds)}
          </span>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={toggle}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-bright"
          aria-label={running ? 'Pause timer' : 'Start timer'}
        >
          {running ? (
            <>
              <Pause className="h-4 w-4" aria-hidden="true" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4" aria-hidden="true" />
              Start
            </>
          )}
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface-1 px-4 py-2.5 text-sm text-ink transition-colors hover:bg-surface-2"
          aria-label="Reset timer"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Reset
        </button>
        <button
          type="button"
          onClick={skip}
          className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface-1 px-4 py-2.5 text-sm text-ink transition-colors hover:bg-surface-2"
          aria-label="Skip phase"
        >
          Skip
        </button>
      </div>

      <p className="mt-6 text-sm text-ink-dim">
        Completed{' '}
        <span className="font-medium text-ink">{cycles}</span>{' '}
        {cycles === 1 ? 'cycle' : 'cycles'} today
      </p>
    </div>
  );
}
