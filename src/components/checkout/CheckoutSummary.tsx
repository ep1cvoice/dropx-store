import Image from "next/image";

import { formatPrice, includedVat } from "@/lib/currency";
import { anton, inter } from "@/lib/fonts";
import type { CartItem } from "@/types/cart";

type CheckoutSummaryProps = {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount?: number;
  promoCode?: string | null;
  total: number;
  currency: string;
};

export default function CheckoutSummary({
  items,
  subtotal,
  shipping,
  discount = 0,
  promoCode = null,
  total,
  currency,
}: CheckoutSummaryProps) {
  const tax = includedVat(total);

  return (
    <div className="min-w-0 rounded-none bg-[#f4f4f2] p-4 sm:p-6">
      <h2
        className={`${inter.className} text-xs font-bold uppercase tracking-[0.16em] text-[#121212]`}
      >
        Order summary
      </h2>

      <ul className="mt-5 space-y-4">
        {items.map((item) => (
          <li key={item.id} className="flex min-w-0 items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-none bg-white ring-1 ring-black/5">
              {item.imageUrl && (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="48px"
                  className="object-contain p-0.5"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={`${anton.className} truncate text-sm uppercase tracking-wide text-[#121212]`}
              >
                {item.name}
              </p>
              <p className={`${inter.className} truncate text-xs text-[#888888]`}>
                {item.size} · Qty: {item.quantity}
              </p>
            </div>
            <span
              className={`${inter.className} shrink-0 text-sm font-semibold text-[#121212]`}
            >
              {formatPrice(item.price * item.quantity, currency)}
            </span>
          </li>
        ))}
      </ul>

      <dl
        className={`${inter.className} mt-5 space-y-3 border-t border-black/10 pt-5 text-sm`}
      >
        <div className="flex items-center justify-between gap-3">
          <dt className="min-w-0 text-[#666666]">Subtotal</dt>
          <dd className="shrink-0 font-semibold text-[#121212]">
            {formatPrice(subtotal, currency)}
          </dd>
        </div>
        {discount > 0 && (
          <div className="flex items-center justify-between gap-3">
            <dt className="min-w-0 text-[#1f9d55]">Discount ({promoCode})</dt>
            <dd className="shrink-0 font-semibold text-[#1f9d55]">
              −{formatPrice(discount, currency)}
            </dd>
          </div>
        )}
        <div className="flex items-center justify-between gap-3">
          <dt className="min-w-0 text-[#666666]">Shipping</dt>
          <dd
            className={
              shipping === 0
                ? "shrink-0 font-bold uppercase tracking-wide text-[#1f9d55]"
                : "shrink-0 font-semibold text-[#121212]"
            }
          >
            {shipping === 0 ? "Free" : formatPrice(shipping, currency)}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="min-w-0 text-[#666666]">Tax (incl. VAT)</dt>
          <dd className="shrink-0 font-semibold text-[#121212]">
            {formatPrice(tax, currency)}
          </dd>
        </div>
      </dl>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-black/10 pt-5">
        <span className={`${inter.className} min-w-0 text-base font-bold text-[#121212]`}>
          Total
        </span>
        <span className={`${inter.className} shrink-0 text-xl font-bold text-[#121212] sm:text-2xl`}>
          {formatPrice(total, currency)}
        </span>
      </div>
    </div>
  );
}
