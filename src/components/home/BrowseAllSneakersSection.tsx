import SneakerGridSection from "@/components/home/SneakerGridSection";
import { getProductCards } from "@/lib/catalog";

export default async function BrowseAllSneakersSection() {
  const products = await getProductCards({ take: 8 });

  return (
    <SneakerGridSection
      title="Browse All Sneakers"
      viewAllHref="/new-drops"
      products={products}
      showBottomCta
      bottomCtaLabel="Browse all"
    />
  );
}
