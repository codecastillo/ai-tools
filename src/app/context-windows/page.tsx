import ContextWindowChart from '@/components/context-window-chart';
import { CONTEXT_FITS } from '@/lib/context-fits';

export const metadata = {
  title: 'Context windows · ai.tools',
  description:
    'How much fits in each LLM context window, from 8K to 2M tokens.',
};

export default function ContextWindowsPage() {
  return (
    <div className="mx-auto max-w-screen-xl px-6 pb-20 pt-10">
      <header className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-ink">
          Context windows
        </h1>
        <p className="mt-3 text-lg text-ink-dim">
          Every model has a hard cap on how many tokens it can read at once.
          Bigger isn&apos;t always better. Cost and latency scale with the
          prompt size.
        </p>
      </header>
      <section className="mt-12">
        <ContextWindowChart />
      </section>
      <section className="mt-16">
        <h2 className="text-center text-2xl font-medium text-ink">
          What fits where
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {CONTEXT_FITS.map((f) => (
            <div
              key={f.tokens}
              className="rounded-xl border border-line bg-surface-1 p-5 text-center"
            >
              <div className="text-3xl font-medium text-ink">{f.label}</div>
              <div className="mt-2 text-sm text-ink">{f.what_fits}</div>
              {f.example && (
                <div className="mt-1 text-xs text-ink-faint italic">
                  {f.example}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
