import Link from "next/link";
import Badge, { type BadgeVariant } from "@/components/ui/Badge";
import { anton, inter } from "@/lib/fonts";

type PlaceholderDrop = {
  id: string;
  brand: string;
  name: string;
  price: string;
  badge: Extract<BadgeVariant, "new" | "limited">;
};

const placeholderDrops: PlaceholderDrop[] = [
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
    <section className="bg-[#f1f1f1] px-4 py-10 md:px-6 lg:px-10 xl:px-14">
      <div className="mx-auto max-w-[1600px]">
        <div className=" px-2 py-4 md:px-3">
          <div className="flex items-end justify-between pb-2">
            <h2
              className={`${anton.className} text-[44px] uppercase leading-[0.9] tracking-[0.01em] text-[#121212]`}
            >
              New Drops
            </h2>

            <Link
              href="/new-drops"
              className={`${inter.className} text-xs font-semibold uppercase tracking-[0.18em] text-[#e85d2a] transition-opacity hover:opacity-70`}
            >
              View all -&gt;
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-3">
            {placeholderDrops.map((drop) => (
              <article key={drop.id} className="min-w-0 bg-transparent">
                <div className="relative aspect-[4/3] bg-[#e6e6e6]">
                  <div className="absolute left-2 top-2">
                    <Badge variant={drop.badge} className="px-2 py-0.5 text-[10px]" />
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
                    {drop.brand}
                  </p>
                  <h3
                    className={`${inter.className} mt-1 line-clamp-2 text-sm font-medium leading-tight text-[#121212]`}
                  >
                    {drop.name}
                  </h3>
                  <p className={`${inter.className} mt-1 text-[28px] font-bold leading-none text-[#121212]`}>
                    {drop.price}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
