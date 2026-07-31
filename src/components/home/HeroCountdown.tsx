"use client";

import { anton, inter } from "@/lib/fonts";
import {
  UPCOMING_DROP,
  countdownUnits,
} from "@/lib/upcoming-drop";
import { useCountdown } from "@/hooks/useCountdown";

type HeroCountdownProps = {
  variant: "mobile" | "desktop";
};

export default function HeroCountdown({ variant }: HeroCountdownProps) {
  const parts = useCountdown(UPCOMING_DROP.dropsAt);
  const units = countdownUnits(parts);

  if (variant === "mobile") {
    return (
      <div className="absolute right-4 top-4 z-10 text-right">
        <p
          className={`${inter.className} text-[8px] font-medium uppercase tracking-[0.18em] text-[#e85d2a]`}
        >
          {parts.isExpired ? "Drop is live" : "Next Drop In"}
        </p>
        <div className="mt-1 flex items-end gap-1.5" aria-live="polite">
          {units.map((item, index) => (
            <div key={`mobile-${item.label}`} className="flex items-end gap-1.5">
              <span
                className={`${anton.className} text-[24px] leading-none text-white tabular-nums`}
              >
                {item.value}
              </span>
              {index !== units.length - 1 && (
                <span
                  className={`${anton.className} text-[20px] leading-none text-white/80`}
                >
                  :
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="ml-auto text-right">
      <p
        className={`${inter.className} text-[9px] font-medium uppercase tracking-[0.22em] text-[#e85d2a] md:text-[10px] md:tracking-[0.24em] lg:text-[11px] lg:tracking-[0.28em]`}
      >
        {parts.isExpired ? "Drop is live" : "Next Drop In"}
      </p>

      <div
        className="mt-2 flex items-end gap-2.5 md:mt-3 md:gap-3 lg:gap-4"
        aria-live="polite"
      >
        {units.map((item, index) => (
          <div
            key={item.label}
            className="flex items-end gap-2.5 md:gap-3 lg:gap-4"
          >
            <div className="text-center">
              <span
                className={`${anton.className} block text-[34px] leading-none text-white tabular-nums md:text-[40px] lg:text-[48px]`}
              >
                {item.value}
              </span>
              <span
                className={`${inter.className} mt-1 block text-[8px] uppercase tracking-[0.14em] text-white/60 md:text-[9px] md:tracking-[0.16em] lg:text-[10px] lg:tracking-[0.2em]`}
              >
                {item.label}
              </span>
            </div>
            {index !== units.length - 1 && (
              <span
                className={`${anton.className} mb-1 text-[26px] leading-none text-white/80 md:mb-1.5 md:text-[32px] lg:mb-2 lg:text-[38px]`}
              >
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
