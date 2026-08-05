"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Lock } from "lucide-react";

import { applyPromoCode, clearPromoCode } from "@/actions/promo";
import Button from "@/components/ui/Button";
import { formatPrice } from "@/lib/currency";
import { inter } from "@/lib/fonts";
import {
  MEMBER_PROMO_CODE,
  MEMBER_PROMO_MIN_SUBTOTAL,
} from "@/lib/promo";

type CartSummaryProps = {
  subtotal: number;
  shipping: number;
  discount: number;
  promoCode: string | null;
  total: number;
  currency: string;
};

export default function CartSummary({
  subtotal,
  shipping,
  discount,
  promoCode,
  total,
  currency,
}: CartSummaryProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const code = draft !== null ? draft : (promoCode ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const remainingForPromo = Math.max(0, MEMBER_PROMO_MIN_SUBTOTAL - subtotal);
  const promoActive = Boolean(promoCode) && discount > 0;
  const promoSavedUnderThreshold = Boolean(promoCode) && discount === 0;

  function handleApply() {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await applyPromoCode(code);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setDraft(null);
      setMessage(result.message);
    });
  }

  function handleClear() {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      await clearPromoCode();
      setDraft(null);
    });
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
        {discount > 0 && (
          <div className="flex items-center justify-between">
            <dt className="text-[#1f9d55]">Discount ({promoCode})</dt>
            <dd className="font-semibold text-[#1f9d55]">
              −{formatPrice(discount, currency)}
            </dd>
          </div>
        )}
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
              setDraft(e.target.value);
              if (message) setMessage(null);
              if (error) setError(null);
            }}
            placeholder="Promo code"
            aria-label="Promo code"
            disabled={pending || Boolean(promoCode)}
            className={`${inter.className} min-w-0 flex-1 rounded-none border border-black/15 bg-white px-3 py-2.5 text-sm text-[#121212] placeholder:text-[#999999] focus:border-[#121212] focus:outline-none disabled:bg-[#ececec]`}
          />
          {promoCode ? (
            <Button
              type="button"
              onClick={handleClear}
              disabled={pending}
              className="shrink-0 cursor-pointer rounded-none"
            >
              Remove
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleApply}
              disabled={pending}
              className="shrink-0 cursor-pointer rounded-none"
            >
              Apply
            </Button>
          )}
        </div>
        {(message || error) && (
          <p
            className={`${inter.className} mt-2 text-xs ${
              error ? "text-[#e11d48]" : "text-[#1f9d55]"
            }`}
          >
            {error ?? message}
          </p>
        )}
        {!promoActive && (
          <p className={`${inter.className} mt-2 text-xs leading-relaxed text-[#888888]`}>
            {promoSavedUnderThreshold ? (
              <>
                {MEMBER_PROMO_CODE} is saved. Add{" "}
                {formatPrice(remainingForPromo, currency)} more to unlock 10%
                off.
              </>
            ) : remainingForPromo > 0 ? (
              <>
                Newsletter members: use {MEMBER_PROMO_CODE} for 10% off when your
                cart reaches €{MEMBER_PROMO_MIN_SUBTOTAL} (need{" "}
                {formatPrice(remainingForPromo, currency)} more).
              </>
            ) : (
              <>
                Cart is over €{MEMBER_PROMO_MIN_SUBTOTAL} — apply {MEMBER_PROMO_CODE}{" "}
                for 10% off if you&apos;re on the drop list.
              </>
            )}
          </p>
        )}
      </div>

      <Link href="/checkout" className="mt-4 block">
        <Button
          variant="accent"
          className="h-12 w-full cursor-pointer rounded-none text-sm font-semibold uppercase tracking-[0.12em]"
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
