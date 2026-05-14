'use client';
import Link from 'next/link';
import type { Tool } from '@/lib/types';
import { categoryStyle } from '@/lib/categories';
import { cn } from '@/lib/cn';
import { use3DTilt } from '@/hooks/use-3d-tilt';
import AddToStackButton from '@/components/add-to-stack-button';
import SaveToolButton from '@/components/save-tool-button';
import TrackerButton from '@/components/tracker-button';
import WhatsNewBadge from '@/components/whats-new-badge';
import TrendingIndicator from '@/components/trending-indicator';

interface ToolCardProps {
  tool: Tool;
  variant?: 'default' | 'featured';
}

export default function ToolCard({ tool, variant = 'default' }: ToolCardProps) {
  const cat = categoryStyle(tool.category);
  const isFeatured = variant === 'featured';
  const tiltRef = use3DTilt<HTMLAnchorElement>({ max: 5, perspective: 1200, speed: 250 });

  return (
    <Link
        ref={tiltRef}
        href={`/tools/${tool.slug}`}
        data-tool-card
        className={cn(
          'group relative flex h-full flex-col overflow-hidden rounded-2xl p-6 text-center transition-all duration-200',
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]',
          'lift-on-hover hover:-translate-y-1',
          'hover:shadow-[0_0_40px_-12px_var(--color-accent-glow)]',
          isFeatured
            ? 'gradient-featured border border-line-2 bg-[--color-surface] p-7 shadow-[0_0_48px_-20px_var(--color-accent-glow),inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-accent/60'
            : 'border-[1.5px] border-line-2 bg-[--color-surface] hover:border-accent/40 hover:bg-[--color-surface-hover]',
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

        {/* Save button now sits in the top-right corner. The body arrow is
            gone so there is no overlap with the category text. */}
        <div className="absolute top-3 right-3 z-10">
          <SaveToolButton slug={tool.slug} variant="icon" size="sm" />
        </div>

        {/* Category dot + label, centered above the title */}
        <div className="flex items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-[0.08em]">
          <span
            className={cn(
              'h-2 w-2 rounded-full transition-transform duration-200 group-hover:scale-125',
              cat.dotClass,
            )}
          />
          <span className={cat.textClass}>{cat.short}</span>
        </div>

        {/* Title */}
        <h3
          className={cn(
            'mt-3 tracking-tight text-ink transition-colors',
            isFeatured ? 'text-display text-2xl' : 'text-lg font-semibold',
          )}
        >
          {tool.title}
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
        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          <WhatsNewBadge tool={tool} />
          <TrendingIndicator popularity={tool.popularity} />
          {tool.pricing && <Chip>{tool.pricing}</Chip>}
          {tool.difficulty && <Chip>{tool.difficulty}</Chip>}
          {tool.time_to_value && <Chip variant="accent">{tool.time_to_value}</Chip>}
        </div>

        {/* Spacer to push footer down */}
        <div className="flex-1" />

        {/* Footer row */}
        <div
          className={cn(
            'mt-5 flex items-center justify-between gap-3 border-t pt-3 text-[11px] text-ink-faint transition-colors',
            isFeatured
              ? 'border-accent/15 group-hover:border-accent/30'
              : 'border-line group-hover:border-line-2',
          )}
        >
          <div className="flex items-center gap-2">
            <AddToStackButton toolId={tool.id} title={tool.title} variant="ghost" />
            <TrackerButton slug={tool.slug} variant="pill" size="sm" />
          </div>
          <span className="font-medium transition-colors group-hover:text-accent">
            Read guide →
          </span>
        </div>
    </Link>
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
          ? 'border-line-2 bg-surface-2 text-accent-bright'
          : 'border-line-2 bg-surface-1 text-ink-mute',
      )}
    >
      {children}
    </span>
  );
}
