import Link from 'next/link';
import { Plus } from 'lucide-react';
import CommandPaletteTrigger from './command-palette-trigger';
import ThemeToggle from './theme-toggle';

export default function SiteHeader() {
  return (
    <header className="relative z-20 border-b border-line-2 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-6 py-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-[15px] font-medium tracking-tight text-ink hover:text-ink"
          >
            <span className="grid h-6 w-6 place-items-center rounded-md bg-accent/15 text-accent">
              <span className="block h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            ai.tools
          </Link>
          <CommandPaletteTrigger />
        </div>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/stacks"
            className="rounded-md px-3 py-1.5 text-ink-dim transition-colors hover:bg-surface-2 hover:text-ink"
          >
            Stacks
          </Link>
          <Link
            href="/compare"
            className="rounded-md px-3 py-1.5 text-ink-dim transition-colors hover:bg-surface-2 hover:text-ink"
          >
            Compare
          </Link>
          <Link
            href="/submit"
            className="ml-1 inline-flex items-center gap-1.5 rounded-md border border-line-2 bg-surface-1 px-3 py-1.5 text-ink-dim transition-colors hover:border-accent/40 hover:bg-accent/10 hover:text-ink"
          >
            <Plus className="h-3.5 w-3.5" />
            Submit
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
