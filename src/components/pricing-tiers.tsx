import { ArrowUpRight, Check, Star } from 'lucide-react';
import type { Tool } from '@/lib/types';
import { cn } from '@/lib/cn';
import Markdown from '@/components/markdown';

interface Props {
  tool: Tool;
  fallbackMd?: string | null;
}

export default function PricingTiers({ tool, fallbackMd }: Props) {
  const tiers = tool.pricing_tiers;

  if (!tiers || tiers.length === 0) {
    return <Markdown source={fallbackMd ?? null} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {tiers.map((tier, i) => {
        const isFree =
          tier.price.trim() === '$0' ||
          tier.price.trim().toLowerCase() === 'free';
        return (
          <div
            key={`${tier.name}-${i}`}
            className={cn(
              'rounded-xl border border-line p-5 text-center',
              tier.highlight ? 'bg-surface-2' : 'bg-surface-1',
            )}
          >
            {tier.highlight && (
              <div className="mb-2 inline-flex items-center justify-center gap-1 text-[11px] uppercase tracking-wider text-accent">
                <Star className="h-3 w-3" />
                Most popular
              </div>
            )}

            <h3 className="text-base font-medium text-ink">{tier.name}</h3>

            <div className="mt-3 flex items-baseline justify-center gap-1">
              {isFree ? (
                <span className="text-3xl font-medium tracking-tight text-ink">
                  {tier.price}
                </span>
              ) : (
                <>
                  <span className="text-3xl font-medium tracking-tight text-ink">
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-sm text-ink-faint">
                      {tier.period.startsWith('/') ? tier.period : `/${tier.period}`}
                    </span>
                  )}
                </>
              )}
            </div>

            <hr className="my-4 border-line" />

            {tier.features.length > 0 && (
              <ul className="space-y-2 text-left text-sm text-ink-dim">
                {tier.features.map((f, j) => (
                  <li
                    key={j}
                    className="flex items-start justify-center gap-2"
                  >
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                    <span className="flex-1 text-left">{f}</span>
                  </li>
                ))}
              </ul>
            )}

            {tier.cta && (
              <a
                href={tier.cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-bright"
              >
                {tier.cta.label}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
