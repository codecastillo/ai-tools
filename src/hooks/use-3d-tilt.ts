'use client';
import { useEffect, useRef } from 'react';

interface TiltOptions {
  /** Max rotation in degrees on either axis. Defaults to 6. */
  max?: number;
  /** CSS perspective in pixels. Defaults to 1000. */
  perspective?: number;
  /** Hover scale multiplier. Defaults to 1. */
  scale?: number;
  /** Transition duration in ms. Defaults to 200. */
  speed?: number;
}

/**
 * Attaches a subtle 3D tilt-on-hover effect to the referenced element. The
 * element rotates around X/Y based on cursor position over its bounding box.
 * Skipped entirely for users that prefer reduced motion.
 */
export function use3DTilt<T extends HTMLElement>(opts: TiltOptions = {}) {
  const { max = 6, perspective = 1000, scale = 1, speed = 200 } = opts;
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const prevTransition = el.style.transition;
    const prevTransform = el.style.transform;
    const prevWillChange = el.style.willChange;

    el.style.transition = `transform ${speed}ms cubic-bezier(0.2, 0.8, 0.2, 1)`;
    el.style.willChange = 'transform';

    const resetTransform = () => {
      el.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`;
    };

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const x = (e.clientX - rect.left) / rect.width; // 0..1
      const y = (e.clientY - rect.top) / rect.height; // 0..1
      const rotateY = (x - 0.5) * 2 * max; // left/right
      const rotateX = -(y - 0.5) * 2 * max; // up/down
      el.style.transform = `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(${scale})`;
    };

    const handleEnter = () => {
      el.style.transition = `transform ${speed}ms cubic-bezier(0.2, 0.8, 0.2, 1)`;
    };

    const handleLeave = () => {
      resetTransform();
    };

    el.addEventListener('mouseenter', handleEnter);
    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);

    return () => {
      el.removeEventListener('mouseenter', handleEnter);
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
      el.style.transition = prevTransition;
      el.style.transform = prevTransform;
      el.style.willChange = prevWillChange;
    };
  }, [max, perspective, scale, speed]);

  return ref;
}
