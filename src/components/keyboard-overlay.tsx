'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Command } from 'lucide-react';

interface KeyboardOverlayCtx {
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
}

const Ctx = createContext<KeyboardOverlayCtx>({
  open: false,
  setOpen: () => {},
  toggle: () => {},
});

export function useKeyboardOverlay(): KeyboardOverlayCtx {
  return useContext(Ctx);
}

export default function KeyboardOverlayProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  const value = useMemo<KeyboardOverlayCtx>(
    () => ({ open, setOpen, toggle }),
    [open, toggle],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <KeyboardOverlay />
    </Ctx.Provider>
  );
}

interface ShortcutRow {
  label: string;
  keys: ReactNode[];
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex min-w-[1.6rem] items-center justify-center rounded border border-white/[0.10] bg-white/[0.04] px-1.5 py-0.5 font-mono text-[11px] uppercase tracking-wider text-ink-dim">
      {children}
    </kbd>
  );
}

function KeyboardOverlay() {
  const { open, setOpen } = useKeyboardOverlay();

  // Lock body scroll while open and prevent any layout shift.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const rows: ShortcutRow[] = [
    {
      label: 'Open command palette',
      keys: [
        <Kbd key="cmd">
          <Command className="h-3 w-3" aria-hidden="true" />
        </Kbd>,
        <span key="plus" className="text-ink-faint">+</span>,
        <Kbd key="k">K</Kbd>,
      ],
    },
    { label: 'Search', keys: [<Kbd key="slash">/</Kbd>] },
    { label: 'Move down through tool cards', keys: [<Kbd key="j">J</Kbd>] },
    { label: 'Move up through tool cards', keys: [<Kbd key="k">K</Kbd>] },
    { label: 'Open the focused tool', keys: [<Kbd key="enter">↵</Kbd>] },
    { label: 'Close any overlay', keys: [<Kbd key="esc">Esc</Kbd>] },
    { label: 'Show this menu', keys: [<Kbd key="q">?</Kbd>] },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-[calc(100%-2rem)] max-w-md rounded-2xl border-[1.5px] border-white/[0.10] bg-[--color-surface] p-7 shadow-2xl ring-1 ring-black/40"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-ink-faint">
          Keyboard shortcuts
        </p>
        <h2 className="mt-1 text-lg font-semibold text-ink">
          Get around faster
        </h2>

        <ul className="mt-5 flex flex-col divide-y divide-white/[0.06]">
          {rows.map((row) => (
            <li
              key={row.label}
              className="flex items-center justify-between gap-4 py-2.5 text-sm text-ink-dim"
            >
              <span>{row.label}</span>
              <span className="inline-flex items-center gap-1">
                {row.keys}
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-5 text-center text-[11px] text-ink-faint">
          Press <Kbd>Esc</Kbd> or click outside to close.
        </p>
      </div>
    </div>
  );
}
