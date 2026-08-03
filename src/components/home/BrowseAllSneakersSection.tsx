import SneakerGridSection from "@/components/home/SneakerGridSection";
import type { ProductCardData } from "@/types/product";

type BrowseAllSneakersSectionProps = {
  products: ProductCardData[];
};

export default function BrowseAllSneakersSection({
  products,
}: BrowseAllSneakersSectionProps) {
  return (
    <SneakerGridSection
      title="Browse All Sneakers"
      viewAllHref="/browse-all"
      products={products}
      desktopCount={10}
      showBottomCta
      bottomCtaLabel="Browse all"
    />
  );
}
