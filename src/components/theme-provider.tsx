'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface Ctx {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeCtx = createContext<Ctx>({
  theme: 'dark',
  setTheme: () => {},
});

/**
 * Reads persisted theme from localStorage on mount, falls back to
 * `prefers-color-scheme`. The actual `data-theme` attribute is set by an
 * inline script in `<head>` (see `src/app/layout.tsx`) so first paint never
 * flashes the wrong palette. This provider stays in sync after hydration
 * and handles user-driven toggles.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('aitools_theme') as Theme | null;
      const initial =
        stored ??
        (window.matchMedia('(prefers-color-scheme: light)').matches
          ? 'light'
          : 'dark');
      setThemeState(initial);
      document.documentElement.setAttribute('data-theme', initial);
    } catch {
      /* private mode, ignore */
    }

    // Stay in sync if another surface (e.g. the command palette action) sets
    // `data-theme` directly. MutationObserver fires same-tab, where the
    // `storage` event does not.
    const observer = new MutationObserver(() => {
      const attr = document.documentElement.getAttribute('data-theme');
      if (attr === 'light' || attr === 'dark') {
        setThemeState((prev) => (prev === attr ? prev : attr));
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    document.documentElement.setAttribute('data-theme', t);
    try {
      localStorage.setItem('aitools_theme', t);
    } catch {
      /* private mode, ignore */
    }
  };

  return (
    <ThemeCtx.Provider value={{ theme, setTheme }}>{children}</ThemeCtx.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeCtx);
}
