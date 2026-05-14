export default function StackSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 pt-10">
      {/* Back link */}
      <div className="h-3 w-20 animate-pulse rounded-md bg-surface-2" />

      {/* Header */}
      <div className="mt-6 border-b border-line pb-8">
        {/* h1 */}
        <div className="h-12 w-2/3 animate-pulse rounded-md bg-surface-2" />

        {/* Description */}
        <div className="mt-4 space-y-2">
          <div className="h-4 w-3/4 animate-pulse rounded-md bg-surface-2" />
          <div className="h-4 w-2/3 animate-pulse rounded-md bg-surface-2" />
        </div>

        {/* Meta row */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="h-4 w-24 animate-pulse rounded-md bg-surface-2" />
          <div className="h-4 w-20 animate-pulse rounded-md bg-surface-2" />
          <div className="h-4 w-28 animate-pulse rounded-md bg-surface-2" />
        </div>
      </div>

      {/* Tool grid */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-40 w-full animate-pulse rounded-xl bg-surface-2"
          />
        ))}
      </div>
    </div>
  );
}
