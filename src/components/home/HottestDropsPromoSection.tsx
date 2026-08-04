import Image from "next/image";
import Link from "next/link";

import { anton, inter } from "@/lib/fonts";
import { ArrowRightIcon } from "lucide-react";

export default function HottestDropsPromoSection() {
  return (
    <section className="bg-[#f1f1f1] pb-10 lg:hidden">
      <div className="mx-auto grid max-w-[1600px]">
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center md:px-10 md:py-20">
          <h2
            className={`${anton.className} max-w-md text-4xl uppercase leading-[0.95] tracking-wide text-[#121212] sm:text-5xl md:text-6xl`}
          >
            Catch the
            <br />
            hottest drops
          </h2>
          <Link
            href="/browse-all?collection=upcoming"
            className={`${inter.className} mt-8 inline-flex items-center justify-center rounded-none bg-[#e85d2a] px-8 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#f06d3a] active:bg-[#d45220]`}
          >
            Shop upcoming
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#e4e4e4]">
          <Image
            src="/pexels-don-williams-2147519897-29640277.jpg"
            alt="Red and black sneakers by the water"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
