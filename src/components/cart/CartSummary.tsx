"use client";

import Link from "next/link";
import { useState } from "react";
import { Lock } from "lucide-react";

import Button from "@/components/ui/Button";
import { formatPrice } from "@/lib/currency";
import { inter } from "@/lib/fonts";

type CartSummaryProps = {
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
};

export default function CartSummary({
  subtotal,
  shipping,
  total,
  currency,
}: CartSummaryProps) {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  function applyPromo() {
    if (!code.trim()) return;
    // Promo engine isn't wired up yet — give honest feedback for now.
    setMessage("That code isn't valid.");
  }

  return (
    <div className="rounded-none bg-[#f4f4f2] p-6 md:p-7">
      <h2
        className={`${inter.className} text-xs font-bold uppercase tracking-[0.16em] text-[#121212]`}
      >
        Order summary
      </h2>

      <dl className={`${inter.className} mt-5 space-y-3 text-sm`}>
        <div className="flex items-center justify-between">
          <dt className="text-[#666666]">Subtotal</dt>
          <dd className="font-semibold text-[#121212]">
            {formatPrice(subtotal, currency)}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-[#666666]">Shipping</dt>
          <dd
            className={
              shipping === 0
                ? "font-bold uppercase tracking-wide text-[#1f9d55]"
                : "font-semibold text-[#121212]"
            }
          >
            {shipping === 0 ? "Free" : formatPrice(shipping, currency)}
          </dd>
        </div>
      </dl>

      <div className="mt-5 flex items-center justify-between border-t border-black/10 pt-5">
        <span
          className={`${inter.className} text-base font-bold text-[#121212]`}
        >
          Total
        </span>
        <span
          className={`${inter.className} text-2xl font-bold text-[#121212]`}
        >
          {formatPrice(total, currency)}
        </span>
      </div>

      <div className="mt-5">
        <div className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (message) setMessage(null);
            }}
            placeholder="Promo code"
            aria-label="Promo code"
            className={`${inter.className} min-w-0 flex-1 rounded-none border border-black/15 bg-white px-3 py-2.5 text-sm text-[#121212] placeholder:text-[#999999] focus:border-[#121212] focus:outline-none`}
          />
          <Button
            type="button"
            onClick={applyPromo}
            className="shrink-0 rounded-none cursor-pointer"
          >
            Apply
          </Button>
        </div>
        {message && (
          <p className={`${inter.className} mt-2 text-xs text-[#e85d2a]`}>
            {message}
          </p>
        )}
      </div>

      <Link href="/checkout" className="mt-4 block">
        <Button
          variant="accent"
          className="h-12 w-full rounded-none cursor-pointer text-sm font-semibold uppercase tracking-[0.12em]"
        >
          Proceed to checkout
        </Button>
      </Link>

      <p
        className={`${inter.className} mt-3 flex items-center justify-center gap-1.5 text-xs text-[#888888]`}
      >
        <Lock size={13} />
        Secure checkout
      </p>
    </div>
  );
}
