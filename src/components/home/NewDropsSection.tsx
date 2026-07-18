import SneakerGridSection from "@/components/home/SneakerGridSection";
import { getProductCards } from "@/lib/catalog";

export default async function NewDropsSection() {
  const products = await getProductCards({ take: 4 });

  return (
    <SneakerGridSection
      title="New Drops"
      viewAllHref="/new-drops"
      products={products}
    />
  );
}
