import CountUp from '@/components/count-up';

interface Props {
  toolCount: number;
  stackCount: number;
  categoryCount: number;
}

export default function SiteStatsBand({
  toolCount,
  stackCount,
  categoryCount,
}: Props) {
  const stats: Array<{
    key: string;
    to: number;
    suffix?: string;
    label: string;
  }> = [
    { key: 'tools', to: toolCount, label: 'Tools indexed' },
    { key: 'stacks', to: stackCount, label: 'Curated stacks' },
    { key: 'categories', to: categoryCount, label: 'Categories' },
    { key: 'glossary', to: 30, suffix: '+', label: 'Glossary terms' },
  ];

  return (
    <section className="border-y border-line bg-surface-1">
      <div className="mx-auto max-w-screen-2xl px-6 lg:px-12 py-12">
        <h2 className="text-2xl md:text-3xl font-medium text-ink text-center">
          By the numbers
        </h2>
        <p className="text-ink-mute text-center mt-2">
          What&apos;s in the catalog right now.
        </p>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat) => (
            <div key={stat.key}>
              <div className="text-4xl md:text-5xl font-medium text-ink tabular-nums">
                <CountUp to={stat.to} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-ink-faint mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
