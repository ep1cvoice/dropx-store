import { anton, inter } from "@/lib/fonts";

type ProductListingSkeletonProps = {
  title: string;
};

export default function ProductListingSkeleton({
  title,
}: ProductListingSkeletonProps) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1600px] px-4 py-8 md:px-6 md:py-10 lg:px-10">
        <div
          className={`${inter.className} mb-5 h-3 w-40 animate-pulse bg-gray-100`}
        />
        <div className="mb-6">
          <h1
            className={`${anton.className} text-4xl uppercase leading-[0.9] tracking-wide text-[#121212] md:text-5xl`}
          >
            {title}
          </h1>
          <p className={`${inter.className} mt-2 text-sm text-[#666666]`}>
            Loading products…
          </p>
        </div>

        <div className="flex flex-col gap-8 min-[1200px]:flex-row min-[1200px]:gap-10">
          <div className="hidden min-[1200px]:block min-[1200px]:w-60 min-[1200px]:shrink-0">
            <div className="space-y-3">
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={i}
                  className="h-4 w-full animate-pulse bg-gray-100"
                />
              ))}
            </div>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-4 min-[1200px]:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="aspect-[4/3] animate-pulse bg-gray-100" />
                <div className="h-3 w-1/3 animate-pulse bg-gray-100" />
                <div className="h-4 w-2/3 animate-pulse bg-gray-100" />
                <div className="h-4 w-1/4 animate-pulse bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
