import type { Category } from './types';

interface CategoryStyle {
  label: string;
  short: string;
  /** Tailwind utility for the category dot/accent. */
  dotClass: string;
  textClass: string;
  bgSubtleClass: string;
  borderClass: string;
}

const STYLES: Record<Category, CategoryStyle> = {
  claude: {
    label: 'Claude ecosystem',
    short: 'claude',
    dotClass: 'bg-[#FF9F66]',
    textClass: 'text-[#FFB280]',
    bgSubtleClass: 'bg-[rgba(255,159,102,0.10)]',
    borderClass: 'border-[rgba(255,159,102,0.30)]',
  },
  clis: {
    label: 'AI coding CLIs',
    short: 'clis',
    dotClass: 'bg-[#86EFAC]',
    textClass: 'text-[#86EFAC]',
    bgSubtleClass: 'bg-[rgba(134,239,172,0.08)]',
    borderClass: 'border-[rgba(134,239,172,0.25)]',
  },
  frameworks: {
    label: 'AI dev frameworks',
    short: 'frameworks',
    dotClass: 'bg-[#5E6AD2]',
    textClass: 'text-[#9FA8F5]',
    bgSubtleClass: 'bg-[rgba(94,106,210,0.10)]',
    borderClass: 'border-[rgba(94,106,210,0.30)]',
  },
  productivity: {
    label: 'AI productivity',
    short: 'productivity',
    dotClass: 'bg-[#FCD34D]',
    textClass: 'text-[#FCD34D]',
    bgSubtleClass: 'bg-[rgba(252,211,77,0.08)]',
    borderClass: 'border-[rgba(252,211,77,0.25)]',
  },
};

const FALLBACK: CategoryStyle = {
  label: 'Uncategorized',
  short: 'other',
  dotClass: 'bg-ink-faint',
  textClass: 'text-ink-mute',
  bgSubtleClass: 'bg-white/[0.03]',
  borderClass: 'border-white/[0.10]',
};

export function categoryStyle(c: Category | null | undefined): CategoryStyle {
  if (!c) return FALLBACK;
  return STYLES[c] ?? FALLBACK;
}
