export function SkeletonLine({ className = "" }) {
  return <div className={`h-3 animate-pulse rounded bg-primary-500/8 ${className}`} />;
}

export function SkeletonBlock({ className = "" }) {
  return <div className={`animate-pulse rounded-lg bg-primary-500/6 ${className}`} />;
}

export function SkeletonRows({ rows = 4, className = "" }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: rows }, (_, i) => (
        <SkeletonBlock key={i} className="h-14" />
      ))}
    </div>
  );
}

export function SkeletonCard({ rows = 5 }) {
  return (
    <div className="rounded-xl border border-primary-500/10 bg-white p-6 shadow-xs">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-5 w-1 rounded-full bg-secondary-500/40" />
        <SkeletonLine className="w-40" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="flex items-center gap-4">
            <SkeletonBlock className="size-10 shrink-0" />
            <div className="flex-1 space-y-2">
              <SkeletonLine className="w-3/4" />
              <SkeletonLine className="w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
