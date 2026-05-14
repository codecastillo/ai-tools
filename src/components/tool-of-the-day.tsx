import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { Tool } from '@/lib/types';
import { categoryStyle } from '@/lib/categories';
import { cn } from '@/lib/cn';

export interface ToolOfTheDayProps {
  tool: Tool;
}

/** Extracts the first non-empty line of the first ```bash fenced block. */
function extractFirstBashLine(md: string | null): string | null {
  if (!md) return null;
  const fence = /```(?:bash|sh|shell|zsh)\n([\s\S]*?)```/i.exec(md);
  if (!fence) return null;
  const body = fence[1] ?? '';
  for (const raw of body.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith('#')) continue; // skip comments
    // Strip a leading `$ ` if present so we don't double it.
    return line.replace(/^\$\s+/, '');
  }
  return null;
}

function formatToday(): string {
  return new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ToolOfTheDay({ tool }: ToolOfTheDayProps) {
  const cat = categoryStyle(tool.category);
  const bashLine = extractFirstBashLine(tool.install_md);
  const promptLine = bashLine ?? `visit ${tool.url}`;

  return (
    <section
      aria-labelledby="tool-of-the-day-title"
      className="motion-safe:section-in section-in relative"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-8 -inset-y-8 -z-10 gradient-featured-wash blur-3xl"
      />
      <div className="gradient-featured overflow-hidden rounded-2xl border border-line-2 bg-[--color-surface] shadow-[0_0_64px_-24px_var(--color-accent-glow),inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div className="grid gap-8 p-6 sm:p-10 md:grid-cols-5">
          {/* Left: 60%. Copy + CTA. */}
          <div className="text-center md:col-span-3">
            <p className="inline-flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-accent-bright">
              <Sparkles className="h-3 w-3" aria-hidden />
              Tool of the day · {formatToday()}
            </p>

            <h2
              id="tool-of-the-day-title"
              className="text-display mt-3 text-4xl text-ink sm:text-5xl"
            >
              {tool.title}
            </h2>

            {tool.tagline && (
              <p className="mx-auto mt-3 max-w-xl text-lg text-ink-dim sm:text-xl">
                {tool.tagline}
              </p>
            )}

            {(tool.category || tool.pricing || tool.difficulty || tool.time_to_value) && (
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                {tool.category && (
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em]',
                      cat.borderClass,
                      cat.bgSubtleClass,
                      cat.textClass,
                    )}
                  >
                    <span className={cn('h-1.5 w-1.5 rounded-full', cat.dotClass)} />
                    {cat.short}
                  </span>
                )}
                {tool.pricing && <Chip>{tool.pricing}</Chip>}
                {tool.difficulty && <Chip>{tool.difficulty}</Chip>}
                {tool.time_to_value && <Chip variant="accent">{tool.time_to_value}</Chip>}
              </div>
            )}

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={`/tools/${tool.slug}`}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-bg shadow-[0_0_24px_-8px_var(--color-accent-glow)] transition-all duration-150 hover:-translate-y-px hover:bg-accent-bright"
              >
                Read the guide
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-line-2 px-5 py-2 text-sm font-medium text-ink-dim transition-all duration-150 hover:border-line-3 hover:text-ink"
              >
                Visit site
              </a>
            </div>
          </div>

          {/* Right: 40%. Static faux terminal. Always dark, text colors are
              hardcoded so the panel reads cleanly in both light and dark
              themes. */}
          <div className="md:col-span-2">
            <div className="overflow-hidden rounded-xl border-2 border-white/[0.10] bg-[#0B0A12] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              {/* macOS chrome */}
              <div className="flex items-center gap-2 border-b border-white/[0.06] px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" aria-hidden />
                <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" aria-hidden />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" aria-hidden />
                <span className="ml-2 font-mono text-[11px] text-[#a8a299]">
                  ai.tools/{tool.slug}
                </span>
              </div>
              <div className="px-4 py-4 font-mono text-[13px] leading-relaxed">
                <div className="flex items-start gap-2">
                  <span className="select-none text-[#FF8B7E]">$</span>
                  <span className="whitespace-pre-wrap break-all text-[#e8e3dc]">
                    {promptLine}
                  </span>
                </div>
                <div className="mt-2 text-[#a8a299]">
                  <span className="select-none">↳ </span>
                  <span className="text-[#cfc9c0]">{tool.title}</span>
                  {tool.tagline ? ` · ${truncate(tool.tagline, 60)}` : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  return `${s.slice(0, n - 1).trimEnd()}…`;
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
        'inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium',
        variant === 'accent'
          ? 'border-line-2 bg-surface-2 text-accent-bright'
          : 'border-line-2 bg-surface-1 text-ink-mute',
      )}
    >
      {children}
    </span>
  );
}
