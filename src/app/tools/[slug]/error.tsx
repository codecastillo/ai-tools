'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, RotateCw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ToolError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[tool/[slug]] error:', error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl px-6 pb-20 pt-16">
      <div className="rounded-xl border border-white/[0.06] bg-[--color-surface] p-8">
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-danger">
          <AlertCircle className="h-3.5 w-3.5" />
          Error
        </div>
        <h1 className="mt-3 text-2xl font-medium tracking-tight text-ink">
          Couldn&apos;t load this tool.
        </h1>
        <p className="mt-3 text-sm text-ink-mute">
          Something went wrong while fetching this page. The database may be
          temporarily unreachable.
        </p>
        {error.digest && (
          <p className="mt-2 font-mono text-[11px] text-ink-faint">
            ref: {error.digest}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 font-medium text-white transition-colors hover:bg-accent-bright"
          >
            <RotateCw className="h-3.5 w-3.5" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.10] bg-white/[0.02] px-4 py-2 text-ink-dim transition-colors hover:border-accent/40 hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
