'use client';

import { Play } from 'lucide-react';

interface AsciinemaEmbedProps {
  castId: string;
}

/**
 * Lightweight placeholder for an asciinema cast. The full
 * `asciinema-player` package is not installed; this surface links out to
 * asciinema.org and visually matches the rest of the chrome.
 *
 * Once the player is available, swap the body for the real player while
 * keeping this same component shape.
 */
export default function AsciinemaEmbed({ castId }: AsciinemaEmbedProps) {
  const safeId = encodeURIComponent(castId);
  const url = `https://asciinema.org/a/${safeId}`;

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-line-2 bg-[--color-bg-elevated,#0a0a0a] shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_1px_2px_rgba(0,0,0,0.4)]">
      <div className="flex items-center justify-between border-b border-line-2 px-3 py-1.5">
        <span className="font-mono text-[11px] uppercase tracking-wide text-ink-faint">
          asciinema · {castId}
        </span>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3 p-6 transition-colors hover:bg-surface-1 motion-reduce:transition-none"
      >
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line-2 bg-surface-2 text-accent">
          <Play className="h-4 w-4 fill-current" aria-hidden="true" />
        </span>
        <span className="flex flex-col">
          <span className="text-sm font-medium text-ink">Play recording</span>
          <span className="text-xs text-ink-mute">
            View this asciinema cast on asciinema.org
          </span>
        </span>
        <span className="ml-auto font-mono text-[11px] uppercase tracking-wide text-ink-faint group-hover:text-ink-mute">
          open ↗
        </span>
      </a>
    </div>
  );
}
