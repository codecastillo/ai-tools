import { Lightbulb, Sparkles, DollarSign, BarChart3, Globe } from 'lucide-react';
import { tipOfTheDay } from '@/lib/tips';
import type { Tip } from '@/lib/tips';

const CATEGORY_ICON: Record<Tip['category'], typeof Lightbulb> = {
  prompt: Lightbulb,
  agent: Sparkles,
  cost: DollarSign,
  eval: BarChart3,
  general: Globe,
};

const CATEGORY_LABEL: Record<Tip['category'], string> = {
  prompt: 'Prompting',
  agent: 'Agents',
  cost: 'Cost',
  eval: 'Evals',
  general: 'General',
};

export default function DailyTipCard() {
  const tip = tipOfTheDay();
  const Icon = CATEGORY_ICON[tip.category];

  return (
    <section className="rounded-2xl border border-line bg-surface-1 p-6 md:p-8 text-center max-w-2xl mx-auto">
      <div className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface-2">
        <Icon className="h-5 w-5 text-accent" aria-hidden />
      </div>
      <p className="mt-3 font-mono text-[11px] font-medium uppercase tracking-wider text-accent">
        Tip of the day
      </p>
      <p className="mt-4 text-xl md:text-2xl text-ink leading-relaxed">
        {tip.text}
      </p>
      <p className="mt-5 text-xs text-ink-faint uppercase tracking-wider">
        {CATEGORY_LABEL[tip.category]}
      </p>
    </section>
  );
}
