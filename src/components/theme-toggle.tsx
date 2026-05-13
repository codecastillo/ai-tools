'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from './theme-provider';

/**
 * Top-right header control. Renders the icon for the theme the user can
 * switch TO, so it doubles as a hint. State lives in the ThemeProvider.
 */
export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isLight = theme === 'light';
  return (
    <button
      type="button"
      onClick={() => setTheme(isLight ? 'dark' : 'light')}
      aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
      title={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-surface-1 text-ink-dim transition-colors hover:bg-surface-2 hover:text-ink"
    >
      {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </button>
  );
}
