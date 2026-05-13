import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { getToolBySlug } from '@/lib/db';
import { categoryStyle } from '@/lib/categories';
import { cn } from '@/lib/cn';
import CompareDelta from '@/components/compare-delta';
import type { Tool } from '@/lib/types';

interface ComparePageProps {
  params: Promise<{ a: string; b: string }>;
}

export async function generateMetadata({ params }: ComparePageProps): Promise<Metadata> {
  const { a, b } = await params;
  let toolA, toolB;
  try {
    [toolA, toolB] = await Promise.all([getToolBySlug(a), getToolBySlug(b)]);
  } catch {
    return { title: 'Not found' };
  }
  if (!toolA || !toolB) return { title: 'Not found' };

  const title = `${toolA.title} vs ${toolB.title} · ai.tools`;
  const description =
    `Side-by-side comparison of ${toolA.title} and ${toolB.title}: ` +
    `${toolA.tagline ?? toolA.description ?? ''} vs ${toolB.tagline ?? toolB.description ?? ''}`.trim();

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function CompareDetailPage({ params }: ComparePageProps) {
  const { a, b } = await params;
  const [toolA, toolB] = await Promise.all([getToolBySlug(a), getToolBySlug(b)]);
  if (!toolA || !toolB) notFound();

  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 pt-10">
      <Link
        href="/compare"
        className="inline-flex items-center gap-1.5 text-sm text-ink-mute transition-colors hover:text-ink-dim"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Pick different tools
      </Link>

      <header className="mt-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-faint">
          Compare
        </p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight text-ink sm:text-4xl">
          <span>{toolA.title}</span>
          <span className="px-3 text-ink-faint">vs</span>
          <span>{toolB.title}</span>
        </h1>
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <ToolHeaderCard tool={toolA} accentColor="#FF6B5B" />
        <ToolHeaderCard tool={toolB} accentColor="#4285F4" />
      </div>

      <CompareDelta a={toolA} b={toolB} />
    </div>
  );
}

function ToolHeaderCard({ tool, accentColor }: { tool: Tool; accentColor: string }) {
  const cat = categoryStyle(tool.category);
  return (
    <article className="rounded-xl border border-line-2 bg-[--color-surface] p-6">
      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.10em]">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: accentColor }}
          aria-hidden
        />
        <span className={cat.textClass}>{cat.short}</span>
      </div>
      <h2 className="mt-2 text-2xl font-medium text-ink">{tool.title}</h2>
      {tool.tagline && <p className="mt-1 text-sm text-ink-dim">{tool.tagline}</p>}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {tool.pricing && <MiniChip>{tool.pricing}</MiniChip>}
        {tool.difficulty && <MiniChip>{tool.difficulty}</MiniChip>}
        {tool.time_to_value && <MiniChip variant="accent">{tool.time_to_value}</MiniChip>}
      </div>
      <Link
        href={`/tools/${tool.slug}`}
        className="mt-4 inline-flex items-center gap-1 text-sm text-accent hover:text-accent-bright"
      >
        Full guide
        <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </article>
  );
}

function MiniChip({
  children,
  variant = 'default',
}: {
  children: React.ReactNode;
  variant?: 'default' | 'accent';
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider',
        variant === 'accent'
          ? 'border-line-2 bg-surface-2 text-accent-bright'
          : 'border-line-2 bg-surface-1 text-ink-mute',
      )}
    >
      {children}
    </span>
  );
}
