'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Code,
  PenLine,
  Search,
  Database,
  Rocket,
  GraduationCap,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import {
  USE_CASES,
  USE_CASE_CATEGORY_LABEL,
  type UseCase,
  type UseCaseCategory,
} from '@/lib/use-cases';

const CATEGORY_ICON: Record<UseCaseCategory, LucideIcon> = {
  code: Code,
  write: PenLine,
  research: Search,
  data: Database,
  ship: Rocket,
  learn: GraduationCap,
};

const CATEGORY_ORDER: UseCaseCategory[] = ['code', 'write', 'research', 'data', 'ship', 'learn'];

type Filter = UseCaseCategory | 'all';

export default function UseCaseGrid() {
  const [filter, setFilter] = useState<Filter>('all');

  const counts = useMemo(() => {
    const out: Record<string, number> = { all: USE_CASES.length };
    for (const u of USE_CASES) {
      out[u.category] = (out[u.category] ?? 0) + 1;
    }
    return out;
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return USE_CASES;
    return USE_CASES.filter((u) => u.category === filter);
  }, [filter]);

  const pillBase =
    'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors';
  const pillActive = 'bg-accent text-white';
  const pillInactive = 'bg-surface-2 text-ink-dim hover:bg-surface-3';

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`${pillBase} ${filter === 'all' ? pillActive : pillInactive}`}
        >
          All
          <span className={`text-[10px] ${filter === 'all' ? 'text-white/80' : 'text-ink-faint'}`}>
            {counts.all}
          </span>
        </button>
        {CATEGORY_ORDER.map((cat) => {
          const active = filter === cat;
          const Icon = CATEGORY_ICON[cat];
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`${pillBase} ${active ? pillActive : pillInactive}`}
            >
              <Icon className="h-3.5 w-3.5" />
              {USE_CASE_CATEGORY_LABEL[cat]}
              <span className={`text-[10px] ${active ? 'text-white/80' : 'text-ink-faint'}`}>
                {counts[cat] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 text-center text-xs text-ink-faint">
        {filtered.length} {filtered.length === 1 ? 'scenario' : 'scenarios'}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((u) => (
          <UseCaseCard key={u.slug} useCase={u} />
        ))}
      </div>
    </div>
  );
}

function UseCaseCard({ useCase }: { useCase: UseCase }) {
  const Icon = CATEGORY_ICON[useCase.category];
  return (
    <article className="rounded-xl border border-line bg-surface-1 p-6 text-center flex flex-col items-center">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 text-accent">
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-3 text-[11px] uppercase tracking-wider text-ink-faint">
        {USE_CASE_CATEGORY_LABEL[useCase.category]}
      </div>
      <h3 className="mt-1 text-lg font-medium text-ink leading-snug">{useCase.intent}</h3>
      <p className="mt-2 text-sm text-ink-dim leading-relaxed">{useCase.body}</p>
      <UseCaseLinks useCase={useCase} />
    </article>
  );
}

function UseCaseLinks({ useCase }: { useCase: UseCase }) {
  const links: { href: string; label: string }[] = [];
  if (useCase.tool_slug) {
    links.push({ href: `/tools/${useCase.tool_slug}`, label: `Try with ${formatSlug(useCase.tool_slug)}` });
  }
  if (useCase.prompt_slug) {
    links.push({ href: `/prompts#${useCase.prompt_slug}`, label: 'Use this prompt' });
  }
  if (useCase.recipe_slug) {
    links.push({ href: `/recipes#${useCase.recipe_slug}`, label: 'Follow this recipe' });
  }
  if (useCase.glossary_slug) {
    links.push({
      href: `/glossary#${useCase.glossary_slug}`,
      label: `Learn about ${formatSlug(useCase.glossary_slug)}`,
    });
  }

  if (links.length === 0) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-line pt-4 w-full">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="inline-flex items-center gap-1 text-xs text-accent hover:gap-1.5 transition-all"
        >
          {link.label}
          <ArrowRight className="h-3 w-3" />
        </Link>
      ))}
    </div>
  );
}

function formatSlug(slug: string): string {
  return slug
    .split('-')
    .map((part) => {
      if (part.length <= 3) return part.toUpperCase();
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(' ');
}
