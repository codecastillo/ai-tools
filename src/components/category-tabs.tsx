import Link from 'next/link';
import { CATEGORIES, type Category } from '@/lib/types';
import { categoryStyle } from '@/lib/categories';
import { cn } from '@/lib/cn';

interface CategoryTabsProps {
  selected: Category | null;
  counts: Record<'all' | Category, number>;
  q?: string;
}

// Hex tints for the active-tab left border. Tailwind JIT can't generate
// arbitrary classes from runtime strings, so we drive the color via inline
// style on the active tab.
const CATEGORY_HEX: Record<Category | 'all', string> = {
  all: '#5E6AD2',
  claude: '#FF9F66',
  clis: '#86EFAC',
  frameworks: '#5E6AD2',
  productivity: '#FCD34D',
};

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
        dotClass="bg-accent"
        accentHex={CATEGORY_HEX.all}
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
            accentHex={CATEGORY_HEX[c]}
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
  accentHex,
}: {
  href: string;
  active: boolean;
  label: string;
  count: number;
  dotClass?: string;
  accentHex?: string;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      style={
        active && accentHex
          ? { borderLeftColor: accentHex, borderLeftWidth: 2 }
          : undefined
      }
      className={cn(
        'group inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-all duration-150',
        active
          ? 'border-white/[0.16] bg-white/[0.08] text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'
          : 'border-transparent text-ink-mute hover:border-white/[0.08] hover:bg-white/[0.03] hover:text-ink-dim',
      )}
    >
      {dotClass && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full transition-transform duration-150',
            dotClass,
            active ? 'scale-125' : 'group-hover:scale-125',
          )}
        />
      )}
      <span>{label}</span>
      <span
        className={cn(
          'text-[11px] tabular-nums transition-colors',
          active ? 'text-ink-dim' : 'text-ink-faint group-hover:text-ink-mute',
        )}
      >
        {count}
      </span>
    </Link>
  );
}
