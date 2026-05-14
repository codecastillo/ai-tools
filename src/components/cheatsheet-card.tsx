import Link from 'next/link';
import { ArrowUpRight, FileText } from 'lucide-react';
import { categoryStyle } from '@/lib/categories';
import { cn } from '@/lib/cn';
import type { Tool } from '@/lib/types';

interface Props {
  tool: Tool;
}

export default function CheatsheetCard({ tool }: Props) {
  const cat = categoryStyle(tool.category);

  return (
    <Link
      href={`/cheatsheets/${tool.slug}`}
      className={cn(
        'group relative flex h-full flex-col items-center overflow-hidden rounded-2xl p-6 text-center transition-all duration-200',
        'border-[1.5px] border-line-2 bg-[--color-surface]',
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]',
        'lift-on-hover hover:-translate-y-1 hover:border-accent/40 hover:bg-[--color-surface-hover]',
        'hover:shadow-[0_0_40px_-12px_var(--color-accent-glow)]',
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-xl border border-line-2 bg-surface-2 transition-colors group-hover:border-line-3',
        )}
      >
        <FileText className={cn('h-5 w-5', cat.textClass)} />
      </div>

      <div className="mt-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.08em]">
        <span
          className={cn(
            'h-2 w-2 rounded-full transition-transform duration-200 group-hover:scale-125',
            cat.dotClass,
          )}
        />
        <span className={cat.textClass}>{cat.short}</span>
      </div>

      <h3 className="mt-2 text-lg font-semibold tracking-tight text-ink transition-colors">
        {tool.title}
      </h3>

      {tool.tagline && (
        <p className="mt-1 text-sm text-ink-mute line-clamp-2">{tool.tagline}</p>
      )}

      <div className="flex-1" />

      <div className="mt-5 flex w-full items-center justify-center gap-1.5 border-t border-line pt-3 text-[12px] font-medium text-ink-faint transition-colors group-hover:border-line-2 group-hover:text-accent">
        View cheatsheet
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Link>
  );
}
