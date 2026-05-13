export default function ToolLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-20 pt-10">
      <div className="h-4 w-24 animate-pulse rounded-md bg-white/[0.04]" />

      <div className="mt-6 grid gap-12 lg:grid-cols-[1fr_200px]">
        <div className="min-w-0">
          {/* Header skeleton */}
          <div className="border-b border-white/[0.06] pb-8">
            <div className="h-3 w-32 animate-pulse rounded-md bg-white/[0.04]" />
            <div className="mt-4 h-10 w-2/3 animate-pulse rounded-md bg-white/[0.04] sm:h-12" />
            <div className="mt-4 h-5 w-3/4 animate-pulse rounded-md bg-white/[0.04]" />
            <div className="mt-3 h-4 w-full animate-pulse rounded-md bg-white/[0.04]" />
            <div className="mt-2 h-4 w-5/6 animate-pulse rounded-md bg-white/[0.04]" />

            <div className="mt-6 flex flex-wrap gap-2">
              <div className="h-5 w-14 animate-pulse rounded-md bg-white/[0.04]" />
              <div className="h-5 w-16 animate-pulse rounded-md bg-white/[0.04]" />
              <div className="h-5 w-20 animate-pulse rounded-md bg-white/[0.04]" />
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="h-9 w-32 animate-pulse rounded-md bg-white/[0.04]" />
              <div className="h-4 w-28 animate-pulse rounded-md bg-white/[0.04]" />
            </div>
          </div>

          {/* Section skeletons */}
          {[0, 1, 2].map((i) => (
            <div key={i} className="mt-10">
              <div className="h-3 w-24 animate-pulse rounded-md bg-white/[0.04]" />
              <div className="mt-4 space-y-2">
                <div className="h-4 w-full animate-pulse rounded-md bg-white/[0.04]" />
                <div className="h-4 w-11/12 animate-pulse rounded-md bg-white/[0.04]" />
                <div className="h-4 w-4/6 animate-pulse rounded-md bg-white/[0.04]" />
              </div>
              <div className="mt-4 h-24 w-full animate-pulse rounded-md bg-white/[0.04]" />
            </div>
          ))}
        </div>

        {/* TOC skeleton */}
        <div className="hidden lg:block">
          <div className="sticky top-24 space-y-2">
            <div className="h-3 w-24 animate-pulse rounded-md bg-white/[0.04]" />
            <div className="h-4 w-20 animate-pulse rounded-md bg-white/[0.04]" />
            <div className="h-4 w-24 animate-pulse rounded-md bg-white/[0.04]" />
            <div className="h-4 w-16 animate-pulse rounded-md bg-white/[0.04]" />
            <div className="h-4 w-20 animate-pulse rounded-md bg-white/[0.04]" />
          </div>
        </div>
      </div>
    </div>
  );
}
