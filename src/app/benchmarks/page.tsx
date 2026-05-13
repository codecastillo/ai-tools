import BenchmarkTable from '@/components/benchmark-table';

export const metadata = {
  title: 'LLM benchmarks · ai.tools',
  description:
    'Frontier LLM benchmark scores across MMLU, HumanEval, MATH, GPQA, SWE-Bench, and MT-Bench.',
};

export default function BenchmarksPage() {
  return (
    <div className="mx-auto max-w-screen-xl px-6 pb-20 pt-10">
      <header className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-ink">
          LLM benchmarks
        </h1>
        <p className="mt-3 text-lg text-ink-dim">
          Public benchmark scores for frontier models. Pick a metric, sort,
          overlay up to 4 models on the radar.
        </p>
        <p className="mt-2 text-xs text-ink-faint">
          As of early 2026. Benchmarks measure what they measure, real workloads
          vary.
        </p>
      </header>
      <section className="mt-12">
        <BenchmarkTable />
      </section>
    </div>
  );
}
