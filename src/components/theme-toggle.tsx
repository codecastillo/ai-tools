'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from './theme-provider';

type Theme = 'dark' | 'light';

/**
 * Top-right header control. Renders the icon for the theme the user can
 * switch TO, so it doubles as a hint. State lives in the ThemeProvider.
 *
 * When the browser supports the View Transitions API, the toggle plays a
 * circle-wipe from the click point so the new palette ripples outward.
 * Falls back to an immediate swap on Firefox and when the user prefers
 * reduced motion.
 */
export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isLight = theme === 'light';

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next: Theme = isLight ? 'dark' : 'light';

    if (
      typeof document === 'undefined' ||
      !('startViewTransition' in document)
    ) {
      setTheme(next);
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTheme(next);
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    document.documentElement.style.setProperty('--ripple-x', `${x}px`);
    document.documentElement.style.setProperty('--ripple-y', `${y}px`);

    // View Transitions API is not in the default TS lib yet.
    (
      document as Document & {
        startViewTransition: (cb: () => void) => unknown;
      }
    ).startViewTransition(() => {
      setTheme(next);
    });
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
      title={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-surface-1 text-ink-dim transition-colors hover:bg-surface-2 hover:text-ink"
    >
      {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </button>
  );
}
