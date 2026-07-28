'use client';

import Image from "next/image";
import { anton, inter } from "@/lib/fonts";
import Button from "@/components/ui/Button";

const countdownItems = [
  { value: "10", label: "Days" },
  { value: "06", label: "Hrs" },
  { value: "42", label: "Min" },
  { value: "18", label: "Sec" },
];

export default function UpcomingDropSection() {
  return (
    <section className="bg-[#f5f5f0] px-4 py-10 md:px-6 md:py-14 lg:px-10 lg:py-16 xl:px-14">
      <div className="mx-auto flex max-w-[1600px] flex-col items-center gap-8 md:flex-row md:gap-10 lg:gap-16">

        {/* Left — text content */}
        <div className="w-full text-center md:flex-1 md:text-left">
          <p
            className={`${inter.className} text-[10px] font-semibold uppercase tracking-[0.28em] text-[#e85d2a] md:text-[11px]`}
          >
            Upcoming Drop
          </p>

          <h2
            className={`${anton.className} mt-3 text-[52px] uppercase leading-[0.9] tracking-[0.01em] text-black sm:text-[64px] md:mt-4 md:text-[60px] lg:text-[72px] xl:text-[84px]`}
          >
            Air Max 90
            <br />
            &lsquo;Infrared&rsquo; OG
          </h2>

          <p
            className={`${inter.className} mt-4 text-[12px] font-medium uppercase tracking-[0.14em] text-black/40 md:mt-5 md:text-[13px]`}
          >
            August 12, 2026 &mdash; 10:00 CET
          </p>

          {/* Countdown */}
          <div className="mt-5 flex items-start justify-center gap-2.5 md:mt-6 md:justify-start md:gap-3">
            {countdownItems.map((item) => (
              <div key={item.label} className="flex flex-col items-center">
                <div className="flex h-[52px] w-[52px] items-center justify-center bg-[#1a1a1a] md:h-[58px] md:w-[58px] lg:h-[64px] lg:w-[64px]">
                  <span
                    className={`${anton.className} text-[26px] leading-none text-white md:text-[28px] lg:text-[32px]`}
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

          <Button
            variant="accent"
            className="mx-auto mt-6 cursor-pointer rounded-none px-8 py-3 text-sm font-semibold uppercase tracking-[0.14em] md:mx-0 md:mt-7 md:px-10 md:py-3.5"
          >
            Notify Me
          </Button>
        </div>

        {/* Right — sneaker image */}
        <div className="flex w-full items-center justify-center md:flex-1">
          <div className="w-full max-w-[480px] overflow-hidden rounded-none bg-[#e9e9e9] md:max-w-full">
            <div className="relative aspect-[4/3]">
              <Image
                src="/dropAirMax.jpg"
                alt="Nike Air Max 90 Infrared OG"
                fill
                quality={85}
                className="scale-[1.20] object-contain drop-shadow-2xl"
                sizes="(min-width: 768px) 50vw, 90vw"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
