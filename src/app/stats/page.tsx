import StatsDashboard from '@/components/stats-dashboard';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Ecosystem stats · ai.tools',
  description: 'A dashboard view of the AI tooling ecosystem.',
};

export default async function StatsPage() {
  return (
    <div className="mx-auto max-w-screen-xl px-6 pb-20 pt-10">
      <header className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-ink">
          Ecosystem stats
        </h1>
        <p className="mt-3 text-lg text-ink-dim">
          A dashboard view of the AI tooling landscape.
        </p>
        <p className="mt-2 text-xs text-ink-faint">
          Trends below are illustrative composites, not authoritative measurements.
        </p>
      </header>
      <section className="mt-12">
        <StatsDashboard />
      </section>
    </div>
  );
}
