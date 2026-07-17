import Link from "next/link";
import Badge, { type BadgeVariant } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { anton, inter } from "@/lib/fonts";

export type SneakerGridItem = {
  id: string;
  brand: string;
  name: string;
  price: string;
  badge: Extract<BadgeVariant, "new" | "limited">;
};

type SneakerGridSectionProps = {
  title: string;
  viewAllHref: string;
  items: SneakerGridItem[];
  viewAllLabel?: string;
  showBottomCta?: boolean;
  bottomCtaHref?: string;
  bottomCtaLabel?: string;
};

export default function SneakerGridSection({
  title,
  viewAllHref,
  items,
  viewAllLabel = "View all ->",
  showBottomCta = false,
  bottomCtaHref = viewAllHref,
  bottomCtaLabel = "Browse all",
}: SneakerGridSectionProps) {
  return (
    <section className="bg-[#f1f1f1] px-4 py-10 md:px-6 lg:px-10 xl:px-14">
      <div className="mx-auto max-w-[1600px] px-2 py-4 md:px-3">
        <div className="flex items-end justify-between pb-2">
          <h2
            className={`${anton.className} text-[44px] uppercase leading-[0.9] tracking-[0.01em] text-[#121212]`}
          >
            {title}
          </h2>

          <Link
            href={viewAllHref}
            className={`${inter.className} text-xs font-semibold uppercase tracking-[0.18em] text-[#e85d2a] transition-opacity hover:opacity-70`}
          >
            {viewAllLabel}
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-3">
          {items.map((item) => (
            <article key={item.id} className="min-w-0 bg-transparent">
              <div className="relative aspect-[4/3] bg-[#e6e6e6]">
                <div className="absolute left-2 top-2">
                  <Badge variant={item.badge} className="px-2 py-0.5 text-[10px]" />
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
                  {item.brand}
                </p>
                <h3
                  className={`${inter.className} mt-1 line-clamp-2 text-sm font-medium leading-tight text-[#121212]`}
                >
                  {item.name}
                </h3>
                <p className={`${inter.className} mt-1 text-[28px] font-bold leading-none text-[#121212]`}>
                  {item.price}
                </p>
              </div>
            </article>
          ))}
        </div>

        {showBottomCta && (
          <div className="mt-8 flex justify-center">
            <Link href={bottomCtaHref}>
              <Button
                variant="accent"
                className="h-12 w-[280px] cursor-pointer rounded-none px-10 text-sm uppercase tracking-[0.14em]"
              >
                {bottomCtaLabel}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
