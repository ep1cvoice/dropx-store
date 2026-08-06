import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import HeroCountdown from "@/components/home/HeroCountdown";
import HeroScrollCue from "@/components/home/HeroScrollCue";
import HeroViewportSync from "@/components/home/HeroViewportSync";
import { anton, inter } from "@/lib/fonts";
import { UPCOMING_DROP } from "@/lib/upcoming-drop";

/** One full visible screen under the sticky header — synced by HeroViewportSync. */
const HERO_HEIGHT =
  "h-[calc(var(--app-vh,100svh)-var(--site-header-height,0px))] min-h-[calc(var(--app-vh,100svh)-var(--site-header-height,0px))]";

export default function HomeHeroDesktop() {
  return (
    <>
      <HeroViewportSync />

      <section
        className={`relative ${HERO_HEIGHT} w-full overflow-hidden bg-[#07090c] md:hidden`}
      >
        <Image
          src="/homeHeroWP.webp"
          alt="Limited sneaker drop hero"
          fill
          priority
          quality={85}
          className="pointer-events-none object-cover object-[48%_center]"
          sizes="100vw"
        />

        <div className="pointer-events-none absolute inset-0 bg-[#06080b]/28" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/62 via-black/26 to-black/30" />

        <HeroCountdown variant="mobile" />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1600px] flex-col justify-end px-4 pb-28 pt-8">
          <p
            className={`${inter.className} text-[10px] font-medium uppercase tracking-[0.22em] text-[#e85d2a]`}
          >
            {UPCOMING_DROP.heroEyebrow}
          </p>

          <h1
            className={`${anton.className} mt-3 max-w-[260px] text-[78px] uppercase leading-[0.88] tracking-[0.01em] text-white`}
          >
            Limited.
            <br />
            Exclusive.
            <br />
            Yours.
          </h1>

          <Link
            href="/browse-all?collection=new-drops"
            className={`${inter.className} relative z-20 mt-6 inline-flex cursor-pointer items-center justify-center gap-2 rounded-none bg-[#e85d2a] px-8 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#f06d3a] active:bg-[#d45220]`}
          >
            <ArrowRight className="h-4 w-4" strokeWidth={2.1} />
            Shop the drop
          </Link>
        </div>

        <HeroScrollCue />
      </section>

      <section
        className={`relative hidden ${HERO_HEIGHT} w-full overflow-hidden bg-[#07090c] md:block`}
      >
        <Image
          src="/homeHeroWP.webp"
          alt="Limited sneaker drop hero"
          fill
          priority
          quality={85}
          className="pointer-events-none object-cover object-center"
          sizes="100vw"
        />

        <div className="pointer-events-none absolute inset-0 bg-[#06080b]/20" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/55 via-black/18 to-black/35" />
        {/* Soft orange wash on the empty right side (timer zone) — desktop only */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-[#e85d2a]/28 via-[#e85d2a]/10 to-transparent to-[60%]" />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1600px] flex-col justify-between px-6 py-8 pb-32 md:px-8 md:py-10 lg:px-10 lg:py-14 xl:px-14">
          <div>
            <p
              className={`${inter.className} text-[10px] font-medium uppercase tracking-[0.24em] text-[#e85d2a] md:text-xs md:tracking-[0.28em]`}
            >
              {UPCOMING_DROP.heroEyebrow}
            </p>

            <h1
              className={`${anton.className} mt-5 max-w-[420px] text-[64px] uppercase leading-[0.88] tracking-[0.012em] text-white md:mt-6 md:max-w-[480px] md:text-[76px] lg:mt-8 lg:max-w-[520px] lg:text-[92px] xl:text-[108px]`}
            >
              Limited.
              <br />
              Exclusive.
              <br />
              Yours.
            </h1>

            <Link
              href="/browse-all?collection=new-drops"
              className={`${inter.className} relative z-20 mt-6 inline-flex cursor-pointer items-center justify-center gap-2 rounded-none bg-[#e85d2a] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#f06d3a] active:bg-[#d45220] md:mt-7 md:px-8 md:py-3.5 lg:mt-10 lg:px-10 lg:py-4 lg:text-base lg:tracking-[0.18em]`}
            >
              Shop The Drop
              <ArrowRight className="h-4 w-4" strokeWidth={2.1} />
            </Link>
          </div>

          <HeroCountdown variant="desktop" />
        </div>

        <HeroScrollCue />
      </section>
    </>
  );
}
