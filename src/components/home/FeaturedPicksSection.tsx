import SneakerGridSection from "@/components/home/SneakerGridSection";
import type { ProductCardData } from "@/types/product";

type FeaturedPicksSectionProps = {
  products: ProductCardData[];
};

export default function FeaturedPicksSection({
  products,
}: FeaturedPicksSectionProps) {
  return (
    <SneakerGridSection
      title="Featured Picks"
      viewAllHref="/browse-all?collection=featured"
      products={products}
      desktopCount={10}
    />
  );
}
