import Image from "next/image";
import Link from "next/link";

import { UPCOMING_DROP } from "@/lib/upcoming-drop";

export default function UpcomingDropsPosterSection() {
  return (
    <section aria-label="Upcoming drops" className="bg-black">
      <div className="relative aspect-[1670/742] w-full overflow-hidden">
        <Image
          src="/upcoming-drops-poster-dropx.jpg"
          alt="Upcoming drops — exclusive limited releases at DropX"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
          unoptimized
        />

        {/* Full poster → upcoming collection */}
        <Link
          href="/browse-all?collection=upcoming"
          className="absolute inset-0 z-0"
          aria-label="Shop upcoming drops"
        />

        {/* Bottom-right Air Max 90 Infrared hotspot */}
        <Link
          href={UPCOMING_DROP.shopHref}
          className="absolute bottom-[7%] right-[6%] z-10 h-[44%] w-[30%] rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e85d2a]"
          aria-label={`${UPCOMING_DROP.titleLine1} ${UPCOMING_DROP.titleLine2}`}
        />
      </div>
    </section>
  );
}
