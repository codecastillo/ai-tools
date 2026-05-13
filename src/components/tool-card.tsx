import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Tool } from '@/lib/types';
import { categoryStyle } from '@/lib/categories';
import { cn } from '@/lib/cn';
import AddToStackButton from '@/components/add-to-stack-button';
import HoverPreview from '@/components/hover-preview';

interface ToolCardProps {
  tool: Tool;
  variant?: 'default' | 'featured';
}

function timeAgo(iso: string): string {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return '';
  const diff = Date.now() - t;
  const min = Math.round(diff / 60000);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 30) return `${day}d ago`;
  const mo = Math.round(day / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.round(day / 365)}y ago`;
}

export default function ToolCard({ tool, variant = 'default' }: ToolCardProps) {
  const cat = categoryStyle(tool.category);
  const isFeatured = variant === 'featured';

  return (
    <HoverPreview tool={tool}>
      <Link
        href={`/tools/${tool.slug}`}
        data-tool-card
        className={cn(
          'group relative flex h-full flex-col overflow-hidden rounded-2xl p-6 transition-all duration-200',
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]',
          'lift-on-hover hover:-translate-y-1',
          'hover:shadow-[0_0_40px_-12px_var(--color-accent-glow)]',
          isFeatured
            ? 'gradient-featured border-2 border-accent/40 bg-[--color-surface] p-7 shadow-[0_0_48px_-20px_var(--color-accent-glow),inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-accent/60'
            : 'border-[1.5px] border-white/[0.08] bg-[--color-surface] hover:border-accent/40 hover:bg-[--color-surface-hover]',
        )}
      >
        {/* Subtle accent edge highlight on hover */}
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent opacity-0 transition-opacity duration-300',
            'group-hover:opacity-100',
            isFeatured && 'opacity-100',
          )}
        />

        {/* Add-to-stack button — owned by B4, kept absolute-positioned in top-right */}
        <div className="absolute top-3 right-3 z-10">
          <AddToStackButton toolId={tool.id} title={tool.title} />
        </div>

        {/* Category dot + label */}
        <div className="flex items-center justify-between gap-3 pr-10">
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.08em]">
            <span
              className={cn(
                'h-2 w-2 rounded-full transition-transform duration-200 group-hover:scale-125',
                cat.dotClass,
              )}
            />
            <span className={cat.textClass}>{cat.short}</span>
          </div>
          <ArrowUpRight className="h-4 w-4 text-ink-faint transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-bright" />
        </div>

        {/* Title + curated badge */}
        <h3
          className={cn(
            'mt-3 tracking-tight text-ink transition-colors',
            isFeatured ? 'text-display text-2xl' : 'text-lg font-semibold',
          )}
        >
          {tool.title}
          {tool.is_curated && (
            <span className="ml-2 text-[10px] font-normal uppercase tracking-wider text-accent">
              ★ curated
            </span>
          )}
        </h3>

        {tool.tagline && (
          <p
            className={cn(
              'mt-1 text-ink-dim',
              isFeatured ? 'text-base line-clamp-3' : 'text-sm line-clamp-2',
            )}
          >
            {tool.tagline}
          </p>
        )}

        {/* Pricing/difficulty/time chips */}
        {(tool.pricing || tool.difficulty || tool.time_to_value) && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {tool.pricing && <Chip>{tool.pricing}</Chip>}
            {tool.difficulty && <Chip>{tool.difficulty}</Chip>}
            {tool.time_to_value && <Chip variant="accent">{tool.time_to_value}</Chip>}
          </div>
        )}

        {/* Spacer to push footer down */}
        <div className="flex-1" />

        {/* Footer row */}
        <div
          className={cn(
            'mt-5 flex items-center justify-between border-t pt-3 text-[11px] text-ink-faint transition-colors',
            isFeatured
              ? 'border-accent/15 group-hover:border-accent/30'
              : 'border-white/[0.04] group-hover:border-white/[0.08]',
          )}
        >
          <span className="font-mono">added {timeAgo(tool.created_at)}</span>
          <span className="font-medium transition-colors group-hover:text-accent">
            Read guide →
          </span>
        </div>
      </Link>
    </HoverPreview>
  );
}

function Chip({
  children,
  variant = 'default',
}: {
  children: React.ReactNode;
  variant?: 'default' | 'accent';
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg border px-2.5 py-1 text-[12px] font-medium transition-colors',
        variant === 'accent'
          ? 'border-accent/30 bg-accent/10 text-accent-bright'
          : 'border-white/[0.06] bg-white/[0.02] text-ink-mute',
      )}
    >
      {children}
    </span>
  );
}
