export function TicketPreviewSkeleton() {
  return (
    <div className="space-y-4" aria-hidden="true">
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="skeleton-shimmer h-7 w-20 rounded-full"
          />
        ))}
      </div>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="rounded-xl border border-border/60 bg-surface-subtle/40 p-4"
        >
          <div className="skeleton-shimmer mb-3 h-3 w-24 rounded" />
          <div className="space-y-2">
            <div className="skeleton-shimmer h-3 w-full rounded" />
            <div className="skeleton-shimmer h-3 w-[85%] rounded" />
            {i === 3 && (
              <div className="skeleton-shimmer h-3 w-[65%] rounded" />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
