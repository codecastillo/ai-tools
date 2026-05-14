export default function ToolDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 pt-10">
      {/* Back link */}
      <div className="h-3 w-20 animate-pulse rounded-md bg-surface-2" />

      <div className="mt-6 grid gap-12 lg:grid-cols-[1fr_260px]">
        <div className="min-w-0">
          {/* Header */}
          <div className="border-b border-line pb-8">
            {/* Category dot row */}
            <div className="h-3 w-32 animate-pulse rounded-md bg-surface-2" />

            {/* h1 */}
            <div className="mt-4 h-12 w-2/3 animate-pulse rounded-md bg-surface-2" />

            {/* Tagline */}
            <div className="mt-4 h-5 w-3/4 animate-pulse rounded-md bg-surface-2" />

            {/* Description: 3 lines */}
            <div className="mt-4 space-y-2">
              <div className="h-3 w-full animate-pulse rounded-md bg-surface-2" />
              <div className="h-3 w-11/12 animate-pulse rounded-md bg-surface-2" />
              <div className="h-3 w-9/12 animate-pulse rounded-md bg-surface-2" />
            </div>

            {/* Chips row */}
            <div className="mt-6 flex flex-wrap gap-2">
              <div className="h-6 w-16 animate-pulse rounded-md bg-surface-2" />
              <div className="h-6 w-16 animate-pulse rounded-md bg-surface-2" />
              <div className="h-6 w-16 animate-pulse rounded-md bg-surface-2" />
              <div className="h-6 w-16 animate-pulse rounded-md bg-surface-2" />
            </div>

            {/* CTA row */}
            <div className="mt-6 flex items-center gap-3">
              <div className="h-9 w-32 animate-pulse rounded-md bg-surface-2" />
              <div className="h-3 w-40 animate-pulse rounded-md bg-surface-2" />
            </div>
          </div>

          {/* Body sections */}
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="mt-10">
              <div className="mx-auto h-4 w-32 animate-pulse rounded-md bg-surface-2" />
              <div className="mt-4 space-y-2">
                <div className="h-3 w-full animate-pulse rounded-md bg-surface-2" />
                <div className="h-3 w-11/12 animate-pulse rounded-md bg-surface-2" />
                <div className="h-3 w-10/12 animate-pulse rounded-md bg-surface-2" />
                <div className="h-3 w-9/12 animate-pulse rounded-md bg-surface-2" />
                <div className="h-3 w-7/12 animate-pulse rounded-md bg-surface-2" />
              </div>
            </div>
          ))}
        </div>

        {/* Right rail aside */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <div className="h-72 w-full animate-pulse rounded-md bg-surface-2" />
          </div>
        </aside>
      </div>
    </div>
  );
}
