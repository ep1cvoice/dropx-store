import Image from "next/image";
import Link from "next/link";
import { anton } from "@/lib/fonts";

const categories = [
  {
    name: "Running",
    href: "#",
    image: "/Running.jpg",
    alt: "Runner on a track",
  },
  {
    name: "Lifestyle",
    href: "#",
    image: "/Lifestyle.jpg",
    alt: "Lifestyle street look",
  },
  {
    name: "Basketball",
    href: "#",
    image: "/Basketball.jpg",
    alt: "Basketball sneakers",
  },
  {
    name: "Skate",
    href: "#",
    image: "/Skateboarding.jpg",
    alt: "Skateboarder on a skateboard",
  },
];

export default function ShopByCategorySection() {
  return (
    <section className="bg-[#07090c] px-4 py-12 md:px-6 md:py-16 lg:px-10 lg:py-20 xl:px-14">
      <div className="mx-auto max-w-[1600px]">
        <h2
          className={`${anton.className} mb-8 text-[32px] uppercase tracking-[0.03em] text-white md:mb-10 md:text-[40px] lg:mb-12 lg:text-[48px]`}
        >
          Shop by Category
        </h2>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group relative aspect-[3/4] overflow-hidden md:aspect-[2/3] lg:aspect-[3/4]"
            >
              <Image
                src={cat.image}
                alt={cat.alt}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                quality={80}
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

              <div className="absolute bottom-0 left-0 p-4 md:p-5">
                <span
                  className={`${anton.className} block text-[15px] uppercase tracking-[0.06em] text-white md:text-base lg:text-[26px]`}
                >
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
