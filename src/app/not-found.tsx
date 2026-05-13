import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col px-6 pb-20 pt-24 text-center">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-faint">
        404
      </p>
      <h1 className="mt-4 text-4xl font-medium tracking-tight text-ink">
        Not found.
      </h1>
      <p className="mt-3 text-base text-ink-dim">
        That tool, stack, or page doesn&apos;t exist (or hasn&apos;t been approved yet).
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center gap-1.5 self-center rounded-md border border-white/[0.10] bg-white/[0.02] px-4 py-2 text-sm text-ink-dim transition-colors hover:border-accent/40 hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back home
      </Link>
    </div>
  );
}
