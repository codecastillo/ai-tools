import Link from 'next/link';
import { CATEGORIES, type Category } from '@/lib/types';
import { categoryStyle } from '@/lib/categories';
import { cn } from '@/lib/cn';

interface CategoryTabsProps {
  selected: Category | null;
  counts: Record<'all' | Category, number>;
  q?: string;
}

function makeHref(category: Category | null, q?: string): string {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (q) params.set('q', q);
  const qs = params.toString();
  return qs ? `/?${qs}` : '/';
}

export default function CategoryTabs({ selected, counts, q }: CategoryTabsProps) {
  return (
    <nav aria-label="Categories" className="flex flex-wrap items-center gap-1.5">
      <TabLink
        href={makeHref(null, q)}
        active={selected === null}
        label="All"
        count={counts.all}
      />
      {CATEGORIES.map((c) => {
        const cat = categoryStyle(c);
        return (
          <TabLink
            key={c}
            href={makeHref(c, q)}
            active={selected === c}
            label={cat.short}
            count={counts[c]}
            dotClass={cat.dotClass}
          />
        );
      })}
    </nav>
  );
}

function TabLink({
  href,
  active,
  label,
  count,
  dotClass,
}: {
  href: string;
  active: boolean;
  label: string;
  count: number;
  dotClass?: string;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors',
        active
          ? 'border-white/[0.14] bg-white/[0.06] text-ink'
          : 'border-transparent text-ink-mute hover:border-white/[0.06] hover:bg-white/[0.03] hover:text-ink-dim',
      )}
    >
      {dotClass && <span className={cn('h-1.5 w-1.5 rounded-full', dotClass)} />}
      <span>{label}</span>
      <span className={cn('text-[11px]', active ? 'text-ink-dim' : 'text-ink-faint')}>
        {count}
      </span>
    </Link>
  );
}
