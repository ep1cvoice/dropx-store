import { MapPin } from "lucide-react";

import { SHIPPING_CARRIERS } from "@/lib/currency";
import { inter } from "@/lib/fonts";

/** Mirrors checkout payment options in `PaymentForm`. */
const PAYMENT_METHODS = [
  {
    id: "blik",
    label: "BLIK",
    className: "bg-[#121212] text-white",
  },
  {
    id: "card",
    label: "Card",
    className: "bg-gradient-to-br from-[#1a1f71] to-[#0a3d91] text-white",
  },
  {
    id: "przelewy24",
    label: "P24",
    className: "bg-[#d32f2f] text-white",
  },
  {
    id: "apple-pay",
    label: "Apple Pay",
    className: "bg-[#121212] text-white",
  },
  {
    id: "google-pay",
    label: "G Pay",
    className: "bg-white text-[#121212] ring-1 ring-inset ring-black/10",
  },
] as const;

const SHIPPING_TILE_STYLES: Record<string, string> = {
  "inpost-paczkomat": "bg-[#ffcc00] text-[#121212]",
  "inpost-kurier": "bg-[#ffcc00] text-[#121212]",
  dpd: "bg-white text-[#dc0032]",
  dhl: "bg-[#ffcc00] text-[#d40511]",
  poczta: "bg-[#e30613] text-white",
};

function MethodTile({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <span
      className={`${inter.className} inline-flex h-10 min-w-[4.5rem] items-center justify-center rounded-none px-2.5 text-[10px] font-bold uppercase tracking-wide sm:h-11 sm:min-w-[5.25rem] sm:text-[11px] ${className}`}
    >
      {label}
    </span>
  );
}

export default function PaymentShippingBar() {
  return (
    <section
      aria-label="Payment and shipping methods"
      className="border-t border-black/10 bg-[#f1f1f1] text-[#121212]"
    >
      <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-6 py-8 md:gap-10 md:py-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16 lg:px-10">
        <div className="min-w-0 flex-1">
          <h2
            className={`${inter.className} text-xs font-semibold uppercase tracking-[0.14em] text-[#121212]`}
          >
            Payment methods
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {PAYMENT_METHODS.map((method) => (
              <li key={method.id}>
                <MethodTile label={method.label} className={method.className} />
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
            <h2
              className={`${inter.className} text-xs font-semibold uppercase tracking-[0.14em] text-[#121212]`}
            >
              Shipping methods
            </h2>
            <p
              className={`${inter.className} inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.08em] text-[#121212]/60`}
            >
              <MapPin className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
              Poland only
            </p>
          </div>
          <ul className="mt-4 flex flex-wrap gap-2">
            {SHIPPING_CARRIERS.map((carrier) => (
              <li key={carrier.id}>
                <MethodTile
                  label={carrier.label}
                  className={
                    SHIPPING_TILE_STYLES[carrier.id] ??
                    "bg-white text-[#121212]"
                  }
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
