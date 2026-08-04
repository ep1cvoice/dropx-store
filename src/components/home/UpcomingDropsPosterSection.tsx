import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { inter } from "@/lib/fonts";

export default function UpcomingDropsPosterSection() {
  return (
    <section
      aria-label="Upcoming drops"
      className="hidden bg-black lg:block"
    >
      <div className="relative aspect-[1672/941] w-full overflow-hidden">
        <Image
          src="/upcoming-drops-poster-dropx.png"
          alt="Upcoming drops — exclusive limited releases at DropX"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Fills the orange-framed black CTA slot on the poster */}
        <Link
          href="/browse-all?collection=upcoming"
          className={`${inter.className} absolute bottom-[8.2%] left-[23.8%] right-[23.8%] z-10 flex h-[9.2%] items-center justify-center bg-[#e85d2a] text-base font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#f06d3a] active:bg-[#d45220] xl:text-lg`}
        >
          See the upcoming drops
          <ArrowRightIcon className="ml-2 h-5 w-5" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
