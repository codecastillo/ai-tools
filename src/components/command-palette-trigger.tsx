'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useCommandPalette } from './command-palette-provider';

export default function CommandPaletteTrigger() {
  const { setOpen } = useCommandPalette();
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    if (typeof navigator === 'undefined') return;
    const platform = navigator.platform || '';
    const ua = navigator.userAgent || '';
    setIsMac(/Mac|iPhone|iPad|iPod/.test(platform) || /Macintosh/.test(ua));
  }, []);

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label="Open command palette"
      className="group inline-flex items-center gap-2 rounded-md border border-white/[0.14] bg-white/[0.02] px-2.5 py-1.5 text-xs text-ink-mute transition-all hover:border-white/[0.16] hover:bg-white/[0.04] hover:text-ink-dim focus:outline-none focus-visible:border-accent/40 focus-visible:ring-1 focus-visible:ring-accent/30"
    >
      <Search className="h-3.5 w-3.5 text-ink-faint transition-colors group-hover:text-ink-mute" aria-hidden="true" />
      <span className="hidden sm:inline">Search</span>
      <kbd className="ml-1 hidden items-center gap-0.5 rounded border border-white/[0.14] bg-white/[0.03] px-1 py-0.5 font-mono text-[10px] tracking-wider text-ink-faint sm:inline-flex">
        {isMac ? <span className="text-[11px] leading-none">⌘</span> : <span>Ctrl</span>}
        <span>K</span>
      </kbd>
    </button>
  );
}
