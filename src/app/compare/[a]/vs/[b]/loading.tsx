export default function CompareLoading() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 pt-10">
      <div className="h-4 w-32 animate-pulse rounded-md bg-surface-2" />

      <div className="mt-6">
        <div className="h-3 w-20 animate-pulse rounded-md bg-surface-2" />
        <div className="mt-4 h-8 w-2/3 animate-pulse rounded-md bg-surface-2 sm:h-10" />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {[0, 1].map((i) => (
          <article
            key={i}
            className="rounded-xl border border-line bg-[--color-surface]"
          >
            <div className="border-b border-line p-6">
              <div className="h-3 w-16 animate-pulse rounded-md bg-surface-2" />
              <div className="mt-3 h-7 w-1/2 animate-pulse rounded-md bg-surface-2" />
              <div className="mt-2 h-4 w-3/4 animate-pulse rounded-md bg-surface-2" />
              <div className="mt-3 flex gap-1.5">
                <div className="h-4 w-12 animate-pulse rounded-md bg-surface-2" />
                <div className="h-4 w-14 animate-pulse rounded-md bg-surface-2" />
                <div className="h-4 w-16 animate-pulse rounded-md bg-surface-2" />
              </div>
              <div className="mt-4 h-4 w-24 animate-pulse rounded-md bg-surface-2" />
            </div>
            {[0, 1, 2].map((j) => (
              <div key={j} className="border-b border-line p-6 last:border-b-0">
                <div className="h-3 w-20 animate-pulse rounded-md bg-surface-2" />
                <div className="mt-3 space-y-2">
                  <div className="h-4 w-full animate-pulse rounded-md bg-surface-2" />
                  <div className="h-4 w-5/6 animate-pulse rounded-md bg-surface-2" />
                  <div className="h-4 w-4/6 animate-pulse rounded-md bg-surface-2" />
                </div>
              </div>
            ))}
          </article>
        ))}
      </div>
    </div>
  );
}
