import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { listApprovedTools } from '@/lib/db';
import CompareBuilder from '@/components/compare-builder';

// Read-on-demand: the DB hostname isn't resolvable during Railway's build phase.
export const dynamic = 'force-dynamic';

export default async function ComparePage() {
  const { tools } = await listApprovedTools({ limit: 100 });
  return (
    <div className="mx-auto max-w-4xl px-6 pb-20 pt-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-ink-mute transition-colors hover:text-ink-dim"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Home
      </Link>

      <header className="mt-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-faint">
          Compare two tools
        </p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight text-ink sm:text-5xl">
          Side by side.
        </h1>
        <p className="mt-3 max-w-2xl text-base text-ink-dim">
          Pick two tools to see install commands, usage tips, and cheat sheets next to each other.
        </p>
      </header>

      <div className="mt-12">
        <CompareBuilder tools={tools} />
      </div>
    </div>
  );
}
