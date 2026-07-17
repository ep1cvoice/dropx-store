import SneakerGridSection, {
  type SneakerGridItem,
} from "@/components/home/SneakerGridSection";

const placeholderSneakers: SneakerGridItem[] = [
  { id: "1", brand: "Nike", name: "Air Force 1 'Triple White'", price: "€129", badge: "new" },
  { id: "2", brand: "Adidas", name: "Campus 00s 'Core Black'", price: "€119", badge: "limited" },
  { id: "3", brand: "New Balance", name: "2002R 'Rain Cloud'", price: "€169", badge: "new" },
  { id: "4", brand: "Asics", name: "Gel-NYC 'Graphite Grey'", price: "€159", badge: "limited" },
  { id: "5", brand: "Nike", name: "P-6000 'Metallic Silver'", price: "€139", badge: "new" },
  { id: "6", brand: "Adidas", name: "Gazelle Indoor 'Blue Bird'", price: "€129", badge: "limited" },
  { id: "7", brand: "Salomon", name: "XT-6 'White Lunar Rock'", price: "€189", badge: "new" },
  { id: "8", brand: "Puma", name: "Palermo OG 'White Green'", price: "€109", badge: "limited" },
];

export default function BrowseAllSneakersSection() {
  return (
    <SneakerGridSection
      title="Browse All Sneakers"
      viewAllHref="/new-drops"
      items={placeholderSneakers}
      showBottomCta
      bottomCtaLabel="Browse all"
    />
  );
}
