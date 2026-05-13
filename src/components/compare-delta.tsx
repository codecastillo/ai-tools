import { ArrowUpRight, Check, Minus, Star } from 'lucide-react';
import type { PricingTier, Tool } from '@/lib/types';
import { cn } from '@/lib/cn';
import CompareRadarOverlay from '@/components/compare-radar-overlay';

interface Props {
  a: Tool;
  b: Tool;
}

interface Feature {
  id: string;
  label: string;
  predicate: (t: Tool) => boolean;
}

const FEATURES: Feature[] = [
  {
    id: 'free-tier',
    label: 'Free tier',
    predicate: (t) => t.pricing === 'free' || t.pricing === 'freemium' || t.pricing === 'oss',
  },
  {
    id: 'oss',
    label: 'Open source',
    predicate: (t) => t.pricing === 'oss',
  },
  {
    id: 'cli',
    label: 'Command line',
    predicate: (t) => t.category === 'clis' || t.tags.some((s) => /cli|terminal/i.test(s)),
  },
  {
    id: 'ide',
    label: 'IDE integration',
    predicate: (t) => t.tags.some((s) => /ide|editor|vscode|cursor|jetbrains/i.test(s)),
  },
  {
    id: 'api',
    label: 'API access',
    predicate: (t) => t.tags.some((s) => /api|sdk/i.test(s)) || t.category === 'frameworks',
  },
  {
    id: 'agent',
    label: 'Agent / tool use',
    predicate: (t) => t.tags.some((s) => /agent|tool|mcp/i.test(s)),
  },
  {
    id: 'streaming',
    label: 'Streaming responses',
    predicate: (t) => t.category === 'frameworks' || t.tags.some((s) => /stream/i.test(s)),
  },
  {
    id: 'easy',
    label: 'Beginner friendly',
    predicate: (t) => t.difficulty === 'easy',
  },
];

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center">
      <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-ink-faint">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-sm text-ink-dim">{subtitle}</p>
      )}
    </div>
  );
}

function ToolColumnLabel({ name, accentColor }: { name: string; accentColor?: string }) {
  return (
    <div className="mb-3 flex items-center justify-center gap-2 text-sm font-medium text-ink">
      {accentColor && (
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ backgroundColor: accentColor }}
          aria-hidden
        />
      )}
      <span>{name}</span>
    </div>
  );
}

function TierCard({ tier }: { tier: PricingTier }) {
  const isFree =
    tier.price.trim() === '$0' || tier.price.trim().toLowerCase() === 'free';
  return (
    <div
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
            <li key={j} className="flex items-start gap-2">
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
}

function PricingColumn({ tool }: { tool: Tool }) {
  const tiers = tool.pricing_tiers;
  if (!tiers || tiers.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-surface-1 p-6 text-center text-sm text-ink-faint">
        No pricing tiers listed.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {tiers.map((tier, i) => (
        <TierCard key={`${tier.name}-${i}`} tier={tier} />
      ))}
    </div>
  );
}

function FeatureCell({ has }: { has: boolean }) {
  return has ? (
    <Check className="mx-auto h-4 w-4 text-success" aria-label="Yes" />
  ) : (
    <Minus className="mx-auto h-4 w-4 text-ink-faint" aria-label="No" />
  );
}

function WorkflowColumn({ tool }: { tool: Tool }) {
  const workflows = tool.workflows;
  if (!workflows || workflows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-surface-1 p-6 text-center text-sm text-ink-faint">
        No workflows listed.
      </div>
    );
  }
  return (
    <ul className="divide-y divide-white/[0.04] overflow-hidden rounded-xl border border-line bg-surface-1">
      {workflows.map((w, i) => (
        <li key={`${w.title}-${i}`} className="p-5">
          <div className="flex items-baseline gap-3">
            <span className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h4 className="text-sm font-medium text-ink">{w.title}</h4>
          </div>
          {w.outcome && (
            <p className="mt-2 pl-8 text-sm text-ink-dim">{w.outcome}</p>
          )}
        </li>
      ))}
    </ul>
  );
}

export function CompareDelta({ a, b }: Props) {
  const showRadar =
    (a.strengths && a.strengths.length > 0) ||
    (b.strengths && b.strengths.length > 0);

  return (
    <div className="mt-12 space-y-16">
      {showRadar && (
        <section>
          <SectionHeader
            title="Strengths"
            subtitle="Side-by-side capability profile across five axes."
          />
          <div className="mt-6">
            <CompareRadarOverlay
              a={a.strengths}
              b={b.strengths}
              aName={a.title}
              bName={b.title}
            />
          </div>
        </section>
      )}

      <section>
        <SectionHeader title="Pricing" />
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <ToolColumnLabel name={a.title} accentColor="#FF6B5B" />
            <PricingColumn tool={a} />
          </div>
          <div>
            <ToolColumnLabel name={b.title} accentColor="#4285F4" />
            <PricingColumn tool={b} />
          </div>
        </div>
      </section>

      <section>
        <SectionHeader title="Feature matrix" />
        <div className="mt-6 overflow-hidden rounded-xl border border-line bg-surface-1">
          <div className="grid grid-cols-[1fr_auto_auto] items-center gap-x-6 border-b border-line px-5 py-3 text-[11px] font-medium uppercase tracking-wider text-ink-faint">
            <span>Feature</span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: '#FF6B5B' }}
                aria-hidden
              />
              {a.title}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: '#4285F4' }}
                aria-hidden
              />
              {b.title}
            </span>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {FEATURES.map((f) => {
              const hasA = f.predicate(a);
              const hasB = f.predicate(b);
              const differs = hasA !== hasB;
              return (
                <div
                  key={f.id}
                  className={cn(
                    'grid grid-cols-[1fr_auto_auto] items-center gap-x-6 px-5 py-3 text-sm',
                    differs && 'bg-accent/[0.05]',
                  )}
                >
                  <span className="text-ink-dim">{f.label}</span>
                  <span className="w-16 text-center">
                    <FeatureCell has={hasA} />
                  </span>
                  <span className="w-16 text-center">
                    <FeatureCell has={hasB} />
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section>
        <SectionHeader title="Workflow examples" />
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <ToolColumnLabel name={a.title} accentColor="#FF6B5B" />
            <WorkflowColumn tool={a} />
          </div>
          <div>
            <ToolColumnLabel name={b.title} accentColor="#4285F4" />
            <WorkflowColumn tool={b} />
          </div>
        </div>
      </section>
    </div>
  );
}

export default CompareDelta;
