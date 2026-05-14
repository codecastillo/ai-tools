'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function CountUp({
  to,
  duration = 1200,
  prefix = '',
  suffix = '',
}: Props) {
  const [value, setValue] = useState<number>(() => 0);
  const elementRef = useRef<HTMLSpanElement | null>(null);
  const startedRef = useRef<boolean>(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (prefersReducedMotion()) {
      startedRef.current = true;
      setValue(to);
      return;
    }

    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const startTs = performance.now();
      const from = 0;
      const delta = to - from;

      const step = (now: number) => {
        const elapsed = now - startTs;
        const t = Math.min(1, elapsed / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(from + delta * eased);
        if (t < 1) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          setValue(to);
        }
      };

      rafRef.current = requestAnimationFrame(step);
    };

    if (typeof IntersectionObserver === 'undefined') {
      start();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            start();
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [to, duration]);

  return (
    <span ref={elementRef}>
      {prefix}
      {Math.round(value).toLocaleString()}
      {suffix}
    </span>
  );
}
