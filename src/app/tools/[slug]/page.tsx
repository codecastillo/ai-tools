import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react';
import { getToolBySlug } from '@/lib/db';
import { categoryStyle } from '@/lib/categories';
import { cn } from '@/lib/cn';
import Markdown from '@/components/markdown';

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  if (!tool) notFound();

  const cat = categoryStyle(tool.category);
  const lastVerified = tool.last_verified ? tool.last_verified.slice(0, 10) : null;

  return (
    <div className="mx-auto max-w-3xl px-6 pb-20 pt-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-ink-mute transition-colors hover:text-ink-dim"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All tools
      </Link>

      {/* Header */}
      <header className="mt-6 border-b border-white/[0.06] pb-8">
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.10em]">
          <span className={cn('h-1.5 w-1.5 rounded-full', cat.dotClass)} />
          <span className={cat.textClass}>{cat.label}</span>
          {tool.is_curated && (
            <>
              <span className="text-ink-faint">·</span>
              <span className="text-accent">★ Curated</span>
            </>
          )}
        </div>

        <h1 className="mt-3 text-4xl font-medium tracking-tight text-ink sm:text-5xl">
          {tool.title}
        </h1>

        {tool.tagline && (
          <p className="mt-3 text-xl text-ink-dim">{tool.tagline}</p>
        )}

        {tool.description && (
          <p className="mt-4 text-[15px] leading-relaxed text-ink-mute">
            {tool.description}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {tool.pricing && <Chip>{tool.pricing}</Chip>}
          {tool.difficulty && <Chip>{tool.difficulty}</Chip>}
          {tool.time_to_value && <Chip variant="accent">{tool.time_to_value}</Chip>}
          {tool.tags.slice(0, 6).map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 font-medium text-white transition-colors hover:bg-accent-bright"
          >
            Visit website
            <ArrowUpRight className="h-4 w-4" />
          </a>
          {lastVerified && (
            <span className="inline-flex items-center gap-1.5 text-xs text-ink-faint">
              <Check className="h-3.5 w-3.5 text-success" />
              Verified {lastVerified}
            </span>
          )}
        </div>
      </header>

      {/* Sections */}
      {tool.install_md && (
        <Section title="Install" id="install">
          <Markdown source={tool.install_md} />
        </Section>
      )}

      {tool.usage_md && (
        <Section title="How it works" id="usage">
          <Markdown source={tool.usage_md} />
        </Section>
      )}

      {tool.cheatsheet_md && (
        <Section title="Cheat sheet" id="cheatsheet">
          <Markdown source={tool.cheatsheet_md} />
        </Section>
      )}

      {tool.used_in_stacks.length > 0 && (
        <Section title="Used in" id="used-in">
          <ul className="grid gap-2 sm:grid-cols-2">
            {tool.used_in_stacks.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/stacks/${s.slug}`}
                  className="group flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition-all hover:border-accent/30 hover:bg-accent/[0.04]"
                >
                  <span className="font-medium text-ink">{s.name ?? s.slug}</span>
                  <ArrowUpRight className="h-4 w-4 text-ink-faint transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}

function Section({
  title,
  id,
  children,
}: {
  title: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-10">
      <h2 className="text-sm font-medium uppercase tracking-[0.10em] text-ink-faint">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
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
        'inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider',
        variant === 'accent'
          ? 'border-accent/30 bg-accent/10 text-accent-bright'
          : 'border-white/[0.08] bg-white/[0.02] text-ink-mute',
      )}
    >
      {children}
    </span>
  );
}
