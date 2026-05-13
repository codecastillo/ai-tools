import type { Options } from 'canvas-confetti';

/**
 * Fire a motion-safe confetti burst. No-op on SSR or when the user has
 * `prefers-reduced-motion: reduce`. Lazy-imports `canvas-confetti` so it
 * only ships when the burst is actually triggered.
 */
export async function celebrate(opts?: Options): Promise<void> {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const { default: confetti } = await import('canvas-confetti');

  const defaults: Options = {
    particleCount: 60,
    spread: 70,
    origin: { y: 0.7 },
    colors: ['#FF6B5B', '#FFB347', '#FFE9D6', '#FF8470', '#F6F2EC'],
    scalar: 0.9,
    ticks: 200,
  };

  confetti({ ...defaults, ...opts });
}
