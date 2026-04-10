const SkeletonCard = () => (
  <div className="overflow-hidden rounded-2xl border border-border bg-card">
    <div className="h-40 shimmer" />
    <div className="space-y-3 p-4">
      <div className="h-4 w-3/4 rounded-lg shimmer" />
      <div className="h-3 w-1/2 rounded-lg shimmer" />
      <div className="flex justify-between">
        <div className="h-3 w-1/4 rounded-lg shimmer" />
        <div className="h-3 w-1/4 rounded-lg shimmer" />
      </div>
    </div>
  </div>
);

export default SkeletonCard;
