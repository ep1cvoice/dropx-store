import SneakerGridSection, {
  type SneakerGridItem,
} from "@/components/home/SneakerGridSection";

const placeholderDrops: SneakerGridItem[] = [
  {
    id: "1",
    brand: "Nike",
    name: "Air Max 95 'Neon'",
    price: "€179",
    badge: "new",
  },
  {
    id: "2",
    brand: "Asics",
    name: "Gel-Kayano 14 'Silver Black'",
    price: "€169",
    badge: "limited",
  },
  {
    id: "3",
    brand: "Adidas",
    name: "Samba OG 'White Black'",
    price: "€129",
    badge: "new",
  },
  {
    id: "4",
    brand: "New Balance",
    name: "9060 'Sea Salt'",
    price: "€199",
    badge: "limited",
  },
];

export default function TrendingNowSection() {
  return (
    <SneakerGridSection
      title="Featured Picks"
      viewAllHref="/new-drops"
      items={placeholderDrops}
    />
  );
}
