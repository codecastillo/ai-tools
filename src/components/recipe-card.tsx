'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Copy, Check, Clock, BarChart3 } from 'lucide-react';
import type { Recipe } from '@/lib/recipes';
import { DIFFICULTY_LABEL } from '@/lib/recipes';
import type { Tool } from '@/lib/types';
import { categoryStyle } from '@/lib/categories';
import { cn } from '@/lib/cn';

interface Props {
  recipe: Recipe;
  toolMap: Map<string, Tool>;
}

export default function RecipeCard({ recipe, toolMap }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(recipe.config);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can fail in some browsers/contexts. Silently ignore.
    }
  }

  return (
    <article
      className={cn(
        'relative flex flex-col rounded-2xl border border-line-2 bg-[--color-surface]',
        'p-6 md:p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]',
      )}
    >
      {/* Header chips */}
      <div className="flex items-center justify-center gap-2">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-lg border border-line-2 bg-surface-1',
            'px-2.5 py-1 text-[12px] font-medium text-ink-mute',
          )}
        >
          <BarChart3 className="h-3 w-3" />
          {DIFFICULTY_LABEL[recipe.difficulty]}
        </span>
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-lg border border-line-2 bg-surface-1',
            'px-2.5 py-1 text-[12px] font-medium text-ink-mute',
          )}
        >
          <Clock className="h-3 w-3" />
          {recipe.estimated_minutes} min
        </span>
      </div>

      {/* Title */}
      <h2 className="mt-4 text-center text-2xl font-semibold tracking-tight text-ink">
        {recipe.title}
      </h2>

      {/* Tagline */}
      <p className="mt-2 text-center text-ink-dim">{recipe.tagline}</p>

      {/* Tool chip row */}
      <div className="mt-5">
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.08em] text-ink-faint">
          What&apos;s in this stack
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {recipe.tools.map((slug) => {
            const tool = toolMap.get(slug);
            const cat = categoryStyle(tool?.category ?? null);
            const label = tool?.title ?? slug;

            const chipBase =
              'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[12px] font-medium transition-colors';

            if (tool) {
              return (
                <Link
                  key={slug}
                  href={`/tools/${tool.slug}`}
                  className={cn(
                    chipBase,
                    'border-line-2 bg-surface-1 text-ink-dim hover:border-line-3 hover:bg-surface-3 hover:text-ink',
                  )}
                >
                  <span className={cn('h-1.5 w-1.5 rounded-full', cat.dotClass)} />
                  {label}
                </Link>
              );
            }

            return (
              <span
                key={slug}
                className={cn(
                  chipBase,
                  'border-line bg-surface-1 text-ink-mute',
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-ink-faint" />
                {label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Steps */}
      <div className="mt-6">
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.08em] text-ink-faint">
          Steps
        </p>
        <ol className="mt-2 text-left max-w-md mx-auto list-decimal space-y-1.5 pl-5 text-sm text-ink-dim marker:text-ink-faint">
          {recipe.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>

      {/* Config block */}
      <div className="relative mt-6 rounded-lg bg-black/40 p-4 text-left">
        <span className="absolute top-2 left-2 text-[10px] uppercase tracking-wider text-ink-faint">
          {recipe.config_lang}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy config"
          className="absolute top-2 right-2 rounded-md bg-surface-3 p-1.5 hover:bg-surface-3"
        >
          {copied ? (
            <Check className="h-3 w-3 text-success" />
          ) : (
            <Copy className="h-3 w-3 text-ink-faint" />
          )}
        </button>
        <pre className="mt-5 overflow-x-auto text-[12px] font-mono text-ink-dim whitespace-pre-wrap">
          {recipe.config}
        </pre>
      </div>
    </article>
  );
}
