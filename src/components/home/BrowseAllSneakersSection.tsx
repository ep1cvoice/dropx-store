import Link from "next/link";
import Badge, { type BadgeVariant } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { anton, inter } from "@/lib/fonts";

type PlaceholderSneaker = {
  id: string;
  brand: string;
  name: string;
  price: string;
  badge: Extract<BadgeVariant, "new" | "limited">;
};

const placeholderSneakers: PlaceholderSneaker[] = [
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
    <section className="bg-[#f1f1f1] px-4 py-10 md:px-6 lg:px-10 xl:px-14">
      <div className="mx-auto max-w-[1600px] px-2 py-4 md:px-3">
        <div className="flex items-end justify-between pb-2">
          <h2
            className={`${anton.className} text-[44px] uppercase leading-[0.9] tracking-[0.01em] text-[#121212]`}
          >
            Browse All Sneakers
          </h2>
          <Link
            href="/new-drops"
            className={`${inter.className} text-xs font-semibold uppercase tracking-[0.18em] text-[#e85d2a] transition-opacity hover:opacity-70`}
          >
            View all -&gt;
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-3">
          {placeholderSneakers.map((sneaker) => (
            <article key={sneaker.id} className="min-w-0 bg-transparent">
              <div className="relative aspect-[4/3] bg-[#e6e6e6]">
                <div className="absolute left-2 top-2">
                  <Badge variant={sneaker.badge} className="px-2 py-0.5 text-[10px]" />
                </div>
                <div className="flex h-full items-center justify-center">
                  <span
                    className={`${inter.className} text-[11px] uppercase tracking-[0.14em] text-[#9a9a9a]`}
                  >
                    Image coming soon
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <p
                  className={`${inter.className} text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a8a8a]`}
                >
                  {sneaker.brand}
                </p>
                <h3
                  className={`${inter.className} mt-1 line-clamp-2 text-sm font-medium leading-tight text-[#121212]`}
                >
                  {sneaker.name}
                </h3>
                <p className={`${inter.className} mt-1 text-[28px] font-bold leading-none text-[#121212]`}>
                  {sneaker.price}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link href="/new-drops">
            <Button
              variant="accent"
              className="h-12 w-[280px] cursor-pointer rounded-none px-10 text-sm uppercase tracking-[0.14em]"
            >
              Browse all
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
