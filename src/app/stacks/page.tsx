import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { listCuratedStacks } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function StacksPage() {
  const stacks = await listCuratedStacks();

  return (
    <div className="mx-auto max-w-5xl px-6 pb-20 pt-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-ink-mute transition-colors hover:text-ink-dim"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Home
      </Link>

      <header className="mt-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-faint">
          Curated stacks · ready-to-share
        </p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight text-ink sm:text-5xl">
          Hand-picked combinations.
        </h1>
        <p className="mt-3 max-w-2xl text-base text-ink-dim">
          Each stack is a starter kit. Use it as a starting point and remix it.
        </p>
      </header>

      <ul className="mt-12 grid gap-3 sm:grid-cols-2">
        {stacks.map((s) => (
          <li key={s.id}>
            <Link
              href={`/stacks/${s.slug}`}
              className="group flex h-full flex-col rounded-xl border border-white/[0.10] bg-[--color-surface] p-6 transition-all hover:-translate-y-px hover:border-accent/30 hover:bg-accent/[0.04]"
            >
              <span className="text-[11px] font-medium uppercase tracking-[0.10em] text-accent">
                Stack · {s.tool_ids.length} tools
              </span>
              <h2 className="mt-2 text-xl font-medium text-ink">{s.name ?? s.slug}</h2>
              {s.description && (
                <p className="mt-2 text-sm text-ink-dim">{s.description}</p>
              )}
              <div className="mt-auto flex items-center justify-between pt-6 text-sm text-ink-mute">
                <span>View stack</span>
                <ArrowUpRight className="h-4 w-4 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
