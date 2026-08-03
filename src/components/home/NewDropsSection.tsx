import SneakerGridSection from "@/components/home/SneakerGridSection";
import type { ProductCardData } from "@/types/product";

type NewDropsSectionProps = {
  products: ProductCardData[];
};

export default function NewDropsSection({ products }: NewDropsSectionProps) {
  return (
    <SneakerGridSection
      title="New Drops"
      viewAllHref="/browse-all?collection=new-drops"
      products={products}
      desktopCount={5}
    />
  );
}
