"use client";

import Link from "next/link";
import { BellIcon } from "lucide-react";

import Button from "@/components/ui/Button";
import UpcomingDropSpinVideo from "@/components/home/UpcomingDropSpinVideo";
import { useCountdown } from "@/hooks/useCountdown";
import { anton, inter } from "@/lib/fonts";
import {
  UPCOMING_DROP,
  countdownUnits,
} from "@/lib/upcoming-drop";

export default function UpcomingDropSection() {
  const parts = useCountdown(UPCOMING_DROP.dropsAt);
  const units = countdownUnits(parts);

  return (
    <section
      id="upcoming-drop"
      className="scroll-mt-24 bg-[#f5f5f0] px-4 py-10 md:px-6 md:py-14 md:scroll-mt-28 lg:px-10 lg:py-16 xl:px-14"
    >
      <div className="mx-auto flex max-w-[1600px] flex-col items-center gap-8 md:flex-row md:gap-10 lg:gap-16">
        <div className="w-full text-center md:flex-1">
          <p
            className={`${inter.className} text-[10px] font-semibold uppercase tracking-[0.28em] text-[#e85d2a] md:text-[11px]`}
          >
            {parts.isExpired ? "Drop is live" : "Upcoming Drop"}
          </p>

          <h2
            className={`${anton.className} mt-3 text-[52px] uppercase leading-[0.9] tracking-[0.01em] text-black sm:text-[64px] md:mt-4 md:text-[60px] lg:text-[72px] xl:text-[84px]`}
          >
            {UPCOMING_DROP.titleLine1}
            <br />
            {UPCOMING_DROP.titleLine2}
          </h2>

          <p
            className={`${inter.className} mt-4 text-[12px] font-medium uppercase tracking-[0.14em] text-black/40 md:mt-5 md:text-[13px]`}
          >
            {parts.isExpired
              ? "Available now — limited stock"
              : UPCOMING_DROP.displayDate}
          </p>

          <div
            className="mt-5 flex items-start justify-center gap-2.5 md:mt-6 md:gap-3"
            aria-live="polite"
          >
            {units.map((item) => (
              <div key={item.label} className="flex flex-col items-center">
                <div className="flex h-[52px] w-[52px] items-center justify-center bg-[#1a1a1a] md:h-[58px] md:w-[58px] lg:h-[64px] lg:w-[64px]">
                  <span
                    className={`${anton.className} text-[26px] leading-none text-white tabular-nums md:text-[28px] lg:text-[32px]`}
                  >
                    {item.value}
                  </span>
                </div>
                <span
                  className={`${inter.className} mt-1.5 text-[9px] font-medium uppercase tracking-[0.18em] text-black/40 md:text-[10px]`}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {parts.isExpired ? (
            <Link
              href={UPCOMING_DROP.shopHref}
              className="mx-auto mt-6 inline-block md:mt-7"
            >
              <Button
                variant="accent"
                className="cursor-pointer rounded-none px-8 py-3 text-sm font-semibold uppercase tracking-[0.14em] md:px-10 md:py-3.5"
              >
                Shop now
              </Button>
            </Link>
          ) : (
            <div className="mx-auto mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row md:mt-7">
              <Link href={UPCOMING_DROP.shopHref}>
                <Button
                  variant="outline"
                  className="cursor-pointer rounded-none border-[#121212] px-8 py-3 text-sm font-semibold uppercase tracking-[0.14em] md:px-10 md:py-3.5"
                >
                  View product
                </Button>
              </Link>
              <Link
                href="/#newsletter"
                scroll={false}
                onClick={(event) => {
                  event.preventDefault();
                  document
                    .getElementById("newsletter")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                <Button
                  variant="accent"
                  className="cursor-pointer rounded-none px-8 py-3 text-sm font-semibold uppercase tracking-[0.14em] md:px-10 md:py-3.5"
                >
                  Notify Me
                  <BellIcon className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="flex w-full items-center justify-center md:flex-1">
          <Link
            href={UPCOMING_DROP.shopHref}
            aria-label={`View ${UPCOMING_DROP.titleLine1} ${UPCOMING_DROP.titleLine2}`}
            className="block w-full max-w-[480px] overflow-hidden rounded-none transition-opacity hover:opacity-90 md:max-w-full"
          >
            <div className="relative aspect-[4/3]">
              <UpcomingDropSpinVideo />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
