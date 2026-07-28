import SneakerGridSection from "@/components/home/SneakerGridSection";
import { getProductCards } from "@/lib/catalog";

export default async function BrowseAllSneakersSection() {
  const products = await getProductCards({ take: 10 });

  return (
    <SneakerGridSection
      title="Browse All Sneakers"
      viewAllHref="/browse-all"
      products={products}
      showBottomCta
      bottomCtaLabel="Browse all"
    />
  );
}
