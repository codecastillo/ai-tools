'use client';
import { useEffect, useRef } from 'react';

interface MagneticOptions {
  /** How strongly the element follows the cursor. 0..1, defaults to 0.3. */
  strength?: number;
  /** Distance in pixels from the element center at which it starts to activate. */
  range?: number;
}

/**
 * Attaches a magnetic hover effect to the referenced element. When the cursor
 * enters within `range` pixels of the element's center, the element translates
 * toward the cursor scaled by `strength`. Skipped for users that prefer
 * reduced motion.
 */
export function useMagnetic<T extends HTMLElement>(opts: MagneticOptions = {}) {
  const { strength = 0.3, range = 80 } = opts;
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

    el.style.transition = 'transform 150ms cubic-bezier(0.2, 0.8, 0.2, 1)';
    el.style.willChange = 'transform';

    let active = false;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const distance = Math.hypot(dx, dy);

      if (distance < range) {
        const tx = dx * strength;
        const ty = dy * strength;
        el.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px)`;
        active = true;
      } else if (active) {
        el.style.transform = 'translate(0, 0)';
        active = false;
      }
    };

    const handleLeave = () => {
      el.style.transform = 'translate(0, 0)';
      active = false;
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseleave', handleLeave);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseleave', handleLeave);
      el.style.transition = prevTransition;
      el.style.transform = prevTransform;
      el.style.willChange = prevWillChange;
    };
  }, [strength, range]);

  return ref;
}
