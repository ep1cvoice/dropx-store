import SneakerGridSection from "@/components/home/SneakerGridSection";
import { getProductCards } from "@/lib/catalog";

export default async function BrowseAllSneakersSection() {
  const products = await getProductCards({ take: 12 });

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
