import SneakerGridSection, {
  type SneakerGridItem,
} from "@/components/home/SneakerGridSection";

const placeholderDrops: SneakerGridItem[] = [
  {
    id: "1",
    brand: "Nike",
    name: "Air Jordan 1 Retro High OG",
    price: "€189",
    badge: "new",
  },
  {
    id: "2",
    brand: "Adidas",
    name: "Yeezy Boost 350 V2 'Zebra'",
    price: "€249",
    badge: "limited",
  },
  {
    id: "3",
    brand: "New Balance",
    name: "550 'White Green'",
    price: "€139",
    badge: "new",
  },
  {
    id: "4",
    brand: "Nike",
    name: "Dunk Low 'Panda'",
    price: "€119",
    badge: "limited",
  },
];

export default function NewDropsSection() {
  return (
    <SneakerGridSection
      title="New Drops"
      viewAllHref="/new-drops"
      items={placeholderDrops}
    />
  );
}
