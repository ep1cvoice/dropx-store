import Link from "next/link";
import Button from "@/components/ui/Button";
import AtomicReveal from "@/components/ui/AtomicReveal";
import ProductGridSkeleton from "@/components/ui/ProductGridSkeleton";
import ProductCard from "@/components/product/ProductCard";
import { anton, inter } from "@/lib/fonts";
import type { ProductCardData } from "@/types/product";

type SneakerGridSectionProps = {
  title: string;
  viewAllHref?: string;
  products: ProductCardData[];
  viewAllLabel?: string;
  showBottomCta?: boolean;
  bottomCtaHref?: string;
  bottomCtaLabel?: string;
  /** How many cards to show from `lg` up. Extra cards stay visible below `lg`. */
  desktopCount?: number;
};

export default function SneakerGridSection({
  title,
  viewAllHref,
  products,
  viewAllLabel = "View all ->",
  showBottomCta = false,
  bottomCtaHref = viewAllHref,
  bottomCtaLabel = "Browse all",
  desktopCount,
}: SneakerGridSectionProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#f1f1f1] px-4 py-10 md:px-6 lg:px-10 xl:px-14">
      <div className="mx-auto max-w-[1600px] px-2 py-4 md:px-3">
        <div className="flex items-end justify-between pb-2">
          <h2
            className={`${anton.className} text-[44px] uppercase leading-[0.9] tracking-[0.01em] text-[#121212]`}
          >
            {title}
          </h2>

          {viewAllHref ? (
            <Link
              href={viewAllHref}
              className={`${inter.className} text-xs font-semibold uppercase tracking-[0.18em] text-[#e85d2a] transition-opacity hover:opacity-70`}
            >
              {viewAllLabel}
            </Link>
          ) : null}
        </div>

        <AtomicReveal
          className="mt-4"
          fallback={
            <div className="mt-4">
              <ProductGridSkeleton
                count={desktopCount ?? Math.min(products.length, 10)}
              />
            </div>
          }
        >
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5 lg:gap-2.5">
            {products.map((product, index) => (
              <div
                key={product.id}
                className={
                  desktopCount != null && index >= desktopCount
                    ? "lg:hidden"
                    : undefined
                }
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </AtomicReveal>

        {showBottomCta && bottomCtaHref && (
          <div className="mt-8 flex justify-center">
            <Link href={bottomCtaHref}>
              <Button
                variant="accent"
                className="h-12 w-[280px] cursor-pointer rounded-none px-10 text-sm uppercase tracking-[0.14em]"
              >
                {bottomCtaLabel}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
