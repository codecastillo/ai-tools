'use client';

import { useEffect, useState } from 'react';

interface Props {
  phrases: string[];
  typeMs?: number;
  pauseMs?: number;
  deleteMs?: number;
  className?: string;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

type Phase = 'typing' | 'pausing' | 'deleting';

export default function TypingCycle({
  phrases,
  typeMs = 60,
  pauseMs = 1800,
  deleteMs = 30,
  className,
}: Props) {
  const [reduced, setReduced] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const [charCount, setCharCount] = useState<number>(0);
  const [phase, setPhase] = useState<Phase>('typing');

  useEffect(() => {
    setReduced(prefersReducedMotion());
  }, []);

  useEffect(() => {
    if (reduced || phrases.length === 0) return;

    const current = phrases[index] ?? '';

    if (phase === 'typing') {
      if (charCount < current.length) {
        const timer = window.setTimeout(() => {
          setCharCount((c) => c + 1);
        }, typeMs);
        return () => window.clearTimeout(timer);
      }
      const timer = window.setTimeout(() => {
        setPhase('deleting');
      }, pauseMs);
      return () => window.clearTimeout(timer);
    }

    if (phase === 'deleting') {
      if (charCount > 0) {
        const timer = window.setTimeout(() => {
          setCharCount((c) => c - 1);
        }, deleteMs);
        return () => window.clearTimeout(timer);
      }
      setIndex((i) => (i + 1) % phrases.length);
      setPhase('typing');
      return;
    }

    return;
  }, [reduced, phrases, index, charCount, phase, typeMs, pauseMs, deleteMs]);

  if (phrases.length === 0) {
    return <span className={className} />;
  }

  if (reduced) {
    return <span className={className}>{phrases[0]}</span>;
  }

  const currentText = (phrases[index] ?? '').slice(0, charCount);

  return (
    <span className={className}>
      {currentText}
      <span
        aria-hidden
        className="terminal-cursor inline-block w-[2px] h-[1em] bg-accent ml-1 align-middle"
      >
        {' '}
      </span>
    </span>
  );
}
