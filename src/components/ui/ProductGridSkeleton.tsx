/** Compact pulse placeholders matching ProductCard proportions. */
export default function ProductGridSkeleton({
  count = 6,
  className = "grid-cols-2 gap-3 lg:grid-cols-5 lg:gap-2.5",
}: {
  count?: number;
  /** Tailwind grid classes (columns + gap). */
  className?: string;
}) {
  return (
    <div className={`grid ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="aspect-[4/3] animate-pulse bg-[#e5e5e5]" />
          <div className="h-3 w-1/3 animate-pulse bg-[#e5e5e5]" />
          <div className="h-4 w-2/3 animate-pulse bg-[#e5e5e5]" />
          <div className="h-4 w-1/4 animate-pulse bg-[#e5e5e5]" />
        </div>
      ))}
    </div>
  );
}
