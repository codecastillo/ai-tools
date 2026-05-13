import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { getStackBySlug } from '@/lib/db';
import { categoryStyle } from '@/lib/categories';
import { cn } from '@/lib/cn';

interface StackPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: StackPageProps): Promise<Metadata> {
  const { slug } = await params;
  let stack;
  try {
    stack = await getStackBySlug(slug);
  } catch {
    return { title: 'Not found' };
  }
  if (!stack) return { title: 'Not found' };

  const name = stack.name ?? stack.slug;
  const title = `${name} · ai.tools`;
  const description =
    stack.description ?? `A ${stack.tools.length}-tool AI dev stack on ai.tools`;

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

export default async function StackDetail({ params }: StackPageProps) {
  const { slug } = await params;
  const stack = await getStackBySlug(slug);
  if (!stack) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 pb-20 pt-10">
      <Link
        href="/stacks"
        className="inline-flex items-center gap-1.5 text-sm text-ink-mute transition-colors hover:text-ink-dim"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All stacks
      </Link>

      <header className="mt-6 border-b border-white/[0.10] pb-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
          Stack · {stack.tools.length} tools
        </p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight text-ink sm:text-5xl">
          {stack.name ?? stack.slug}
        </h1>
        {stack.description && (
          <p className="mt-4 text-lg text-ink-dim">{stack.description}</p>
        )}
      </header>

      <ol className="mt-10 space-y-3">
        {stack.tools.map((tool, i) => {
          const cat = categoryStyle(tool.category);
          return (
            <li key={tool.id}>
              <Link
                href={`/tools/${tool.slug}`}
                className="group flex items-center gap-4 rounded-xl border border-white/[0.10] bg-[--color-surface] px-5 py-4 transition-all hover:-translate-y-px hover:border-white/[0.14] hover:bg-[--color-surface-hover]"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-white/[0.04] font-mono text-sm font-medium text-ink-faint">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-medium text-ink">{tool.title}</h3>
                    <span className={cn('h-1.5 w-1.5 rounded-full', cat.dotClass)} />
                    <span className={cn('text-[11px] uppercase tracking-wider', cat.textClass)}>
                      {cat.short}
                    </span>
                  </div>
                  {tool.tagline && (
                    <p className="mt-0.5 truncate text-sm text-ink-mute">{tool.tagline}</p>
                  )}
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-faint transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
