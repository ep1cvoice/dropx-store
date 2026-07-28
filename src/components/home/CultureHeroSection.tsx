import Image from "next/image";
import Link from "next/link";

import { anton, inter } from "@/lib/fonts";

export default function CultureHeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#121212]">
      <div className="relative min-h-[50vh] w-full md:min-h-[56vh] lg:min-h-[60vh]">
        <Image
          src="/pexels-omotayo-samuel-329103165-16350687.jpg"
          alt="Sneaker collection flat lay"
          fill
          sizes="100vw"
          className="object-cover"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-end px-6 pb-12 text-center md:pb-16 lg:pb-20">
          <h2
            className={`${anton.className} max-w-3xl text-4xl uppercase leading-[0.95] tracking-wide text-white sm:text-5xl md:text-6xl lg:text-7xl`}
          >
            Icons of the street
          </h2>
          <p
            className={`${inter.className} mt-3 max-w-md text-sm text-white/70 md:text-base`}
          >
            Classics, colorways, and culture — curated for your rotation.
          </p>
          <Link
            href="/browse-all"
            className={`${inter.className} mt-6 inline-flex items-center justify-center rounded-none bg-[#e85d2a] px-8 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#f06d3a] active:bg-[#d45220]`}
          >
            Shop the collection
          </Link>
        </div>
      </div>
    </section>
  );
}
