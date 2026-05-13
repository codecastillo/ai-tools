export default function StackLoading() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-20 pt-10">
      <div className="h-4 w-24 animate-pulse rounded-md bg-surface-2" />

      <div className="mt-6 border-b border-line pb-8">
        <div className="h-3 w-44 animate-pulse rounded-md bg-surface-2" />
        <div className="mt-4 h-10 w-2/3 animate-pulse rounded-md bg-surface-2 sm:h-12" />
        <div className="mt-4 h-5 w-3/4 animate-pulse rounded-md bg-surface-2" />
        <div className="mt-2 h-5 w-2/3 animate-pulse rounded-md bg-surface-2" />
      </div>

      <ol className="mt-10 space-y-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <li
            key={i}
            className="flex items-center gap-4 rounded-xl border border-line bg-[--color-surface] px-5 py-4"
          >
            <div className="h-8 w-8 shrink-0 animate-pulse rounded-md bg-surface-2" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-4 w-1/2 animate-pulse rounded-md bg-surface-2" />
              <div className="h-3 w-3/4 animate-pulse rounded-md bg-surface-2" />
            </div>
            <div className="h-4 w-4 shrink-0 animate-pulse rounded-md bg-surface-2" />
          </li>
        ))}
      </ol>
    </div>
  );
}
