import SneakerGridSection from "@/components/home/SneakerGridSection";
import { getProductCards } from "@/lib/catalog";

export default async function TrendingNowSection() {
  // Show a different slice than New Drops so the two grids don't repeat.
  const products = await getProductCards({ take: 6, skip: 6 });

  return (
    <SneakerGridSection
      title="Featured Picks"
      viewAllHref="/browse-all?collection=featured"
      products={products}
      desktopCount={5}
    />
  );
}
