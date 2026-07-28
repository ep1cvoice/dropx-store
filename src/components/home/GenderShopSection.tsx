import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { anton } from "@/lib/fonts";

const tiles = [
  {
    label: "Male",
    href: "/browse-all?gender=men",
    image: "/pexels-victor-oluwa-324310690-13873170.jpg",
    alt: "Male streetwear look",
    objectPosition: "center 80%",
  },
  {
    label: "Female",
    href: "/browse-all?gender=women",
    image: "/pexels-sliceisop-2331103.jpg",
    alt: "Female streetwear look",
    objectPosition: "center 80%",
  },
  {
    label: "All",
    href: "/browse-all",
    image: "/pexels-grailify-2658558-4252950.jpg",
    alt: "Colorful sneakers",
    objectPosition: "center center",
  },
] as const;

export default function GenderShopSection() {
  return (
    <section className="bg-[#07090c] px-4 py-10 md:px-6 md:py-12 lg:px-10 xl:px-14">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-3 md:gap-4">
        {tiles.map((tile) => (
          <Link
            key={tile.href + tile.label}
            href={tile.href}
            className="group block"
          >
            <div className="relative aspect-square overflow-hidden bg-[#1a1a1a]">
              <Image
                src={tile.image}
                alt={tile.alt}
                fill
                sizes="(min-width: 640px) 33vw, 100vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                style={{ objectPosition: tile.objectPosition }}
              />
            </div>
            <div className="mt-3 flex items-center justify-end gap-2 text-white">
              <span
                className={`${anton.className} text-lg uppercase tracking-[0.04em] md:text-xl lg:text-2xl`}
              >
                {tile.label}
              </span>
              <ArrowRight
                className="size-5 shrink-0 md:size-6"
                strokeWidth={1.75}
                aria-hidden
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
