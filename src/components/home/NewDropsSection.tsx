import SneakerGridSection from "@/components/home/SneakerGridSection";
import { getProductCards } from "@/lib/catalog";

export default async function NewDropsSection() {
  const products = await getProductCards({ take: 6 });

  return (
    <SneakerGridSection
      title="New Drops"
      viewAllHref="/browse-all?collection=new-drops"
      products={products}
      desktopCount={5}
    />
  );
}
