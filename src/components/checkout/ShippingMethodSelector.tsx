"use client";

import { useState } from "react";

import { inter } from "@/lib/fonts";

const METHODS = [
  {
    id: "standard",
    label: "Standard Delivery (3–5 business days)",
    price: "Free",
    free: true,
  },
  {
    id: "express",
    label: "Express Delivery (1–2 business days)",
    price: "€9.95",
    free: false,
  },
] as const;

export default function ShippingMethodSelector() {
  const [selected, setSelected] = useState<string>("standard");

  return (
    <div className={`${inter.className} space-y-3`}>
      {METHODS.map((method) => {
        const active = selected === method.id;
        return (
          <label
            key={method.id}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-4 transition-colors ${
              active
                ? "border-[#121212]"
                : "border-black/15 hover:border-black/30"
            }`}
          >
            <input
              type="radio"
              name="shipping-method"
              value={method.id}
              checked={active}
              onChange={() => setSelected(method.id)}
              className="sr-only"
            />
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                active ? "border-[#121212]" : "border-black/30"
              }`}
            >
              {active && (
                <span className="h-2 w-2 rounded-full bg-[#121212]" />
              )}
            </span>
            <span className="flex-1 text-sm text-[#121212]">
              {method.label}
            </span>
            <span
              className={`text-sm font-semibold ${
                method.free
                  ? "uppercase tracking-wide text-[#1f9d55]"
                  : "text-[#121212]"
              }`}
            >
              {method.price}
            </span>
          </label>
        );
      })}
    </div>
  );
}
