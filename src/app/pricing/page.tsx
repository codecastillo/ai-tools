import { LLM_RATES } from '@/lib/llm-rates';
import PricingTable from '@/components/pricing-table';
import CostSimulator from '@/components/cost-simulator';
import PriceScatter from '@/components/price-scatter';
import PriceBarChart from '@/components/price-bar-chart';

export const metadata = {
  title: 'LLM pricing · ai.tools',
  description:
    'Per-million-token rates and a monthly cost calculator for the major LLM APIs.',
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-screen-2xl px-6 lg:px-12 pb-20 pt-10">
      <header className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-ink">
          LLM pricing
        </h1>
        <p className="mt-3 text-lg text-ink-dim">
          Per-million-token rates for the major frontier models, plus a
          calculator that estimates your monthly API spend.
        </p>
        <p className="mt-2 text-xs text-ink-faint">
          Rates as of early 2026, always check the provider&apos;s pricing page
          before committing budget.
        </p>
      </header>

      <section className="mt-12 grid gap-6 lg:grid-cols-2">
        <PriceScatter rates={LLM_RATES} />
        <PriceBarChart rates={LLM_RATES} />
      </section>

      <section className="mt-12">
        <PricingTable rates={LLM_RATES} />
      </section>

      <section className="mt-16">
        <CostSimulator />
      </section>

      <section className="mt-16 text-center">
        <h2 className="text-2xl font-medium text-ink">How to read this</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3 text-sm text-ink-dim text-left">
          <div className="rounded-xl border border-line bg-surface-1 p-5">
            <div className="text-ink font-medium">Input vs output</div>
            <p className="mt-2">
              Most APIs price output 3-5x higher than input. Long context =
              expensive input. Long answers = expensive output.
            </p>
          </div>
          <div className="rounded-xl border border-line bg-surface-1 p-5">
            <div className="text-ink font-medium">Prompt caching</div>
            <p className="mt-2">
              Anthropic, OpenAI, and Google all let you cache long stable
              prefixes. Cache hits run at roughly 10 percent of normal input
              cost.
            </p>
          </div>
          <div className="rounded-xl border border-line bg-surface-1 p-5">
            <div className="text-ink font-medium">Batch APIs</div>
            <p className="mt-2">
              Submit non-urgent work as a batch and pay half. Perfect for
              evals, backfills, and overnight pipelines.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
