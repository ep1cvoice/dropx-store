"use client";

import { anton, inter } from "@/lib/fonts";
import { countdownUnits } from "@/lib/upcoming-drop";
import { useCountdown } from "@/hooks/useCountdown";

type ProductDropCountdownProps = {
  availableAt: string;
  variant?: "card" | "detail";
};

export default function ProductDropCountdown({
  availableAt,
  variant = "card",
}: ProductDropCountdownProps) {
  const parts = useCountdown(availableAt);
  const units = countdownUnits(parts);

  if (parts.isExpired) return null;

  if (variant === "card") {
    return (
      <div className="absolute inset-x-0 bottom-0 bg-black/75 px-2 py-1.5 text-center">
        <p
          className={`${inter.className} text-[9px] font-semibold uppercase tracking-[0.14em] text-[#e85d2a]`}
        >
          Drops in
        </p>
        <p
          className={`${anton.className} mt-0.5 text-sm leading-none tracking-wide text-white tabular-nums`}
        >
          {units.map((u) => u.value).join(":")}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-5 border border-black/10 bg-[#f5f5f0] px-4 py-4">
      <p
        className={`${inter.className} text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e85d2a]`}
      >
        Upcoming drop
      </p>
      <div className="mt-3 flex gap-2" aria-live="polite">
        {units.map((item) => (
          <div key={item.label} className="flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center bg-[#1a1a1a]">
              <span
                className={`${anton.className} text-xl leading-none text-white tabular-nums`}
              >
                {item.value}
              </span>
            </div>
            <span
              className={`${inter.className} mt-1 text-[9px] uppercase tracking-[0.16em] text-black/40`}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
      <p className={`${inter.className} mt-3 text-xs text-[#555555]`}>
        Notify via the drop list — this pair is not for sale until premiere.
      </p>
    </div>
  );
}
