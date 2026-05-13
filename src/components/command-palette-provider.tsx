'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import CommandPalette from './command-palette';

interface CommandPaletteCtx {
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
}

const Ctx = createContext<CommandPaletteCtx>({
  open: false,
  setOpen: () => {},
  toggle: () => {},
});

export function useCommandPalette(): CommandPaletteCtx {
  return useContext(Ctx);
}

export default function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen((v) => !v), []);

  const value = useMemo<CommandPaletteCtx>(
    () => ({ open, setOpen, toggle }),
    [open, toggle],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <CommandPalette />
    </Ctx.Provider>
  );
}
