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
  const stats = [
    { value: `${toolCount}`, label: 'Tools indexed' },
    { value: `${stackCount}`, label: 'Curated stacks' },
    { value: `${categoryCount}`, label: 'Categories' },
    { value: '30+', label: 'Glossary terms' },
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
            <div key={stat.label}>
              <div className="text-4xl md:text-5xl font-medium text-ink">
                {stat.value}
              </div>
              <div className="text-sm text-ink-faint mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
