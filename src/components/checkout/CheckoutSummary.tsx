import Image from "next/image";

import { formatPrice, includedVat } from "@/lib/currency";
import { anton, inter } from "@/lib/fonts";
import type { CartItem } from "@/types/cart";

type CheckoutSummaryProps = {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
};

export default function CheckoutSummary({
  items,
  subtotal,
  shipping,
  total,
  currency,
}: CheckoutSummaryProps) {
  const tax = includedVat(total);

  return (
    <div className="rounded-none bg-[#f4f4f2] p-6">
      <h2
        className={`${inter.className} text-xs font-bold uppercase tracking-[0.16em] text-[#121212]`}
      >
        Order summary
      </h2>

      <ul className="mt-5 space-y-4">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-none bg-[#eef4ff]">
              {item.imageUrl && (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={`${anton.className} truncate text-sm uppercase tracking-wide text-[#121212]`}
              >
                {item.name}
              </p>
              <p className={`${inter.className} text-xs text-[#888888]`}>
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
        <div className="flex items-center justify-between">
          <dt className="text-[#666666]">Tax (incl. VAT)</dt>
          <dd className="font-semibold text-[#121212]">
            {formatPrice(tax, currency)}
          </dd>
        </div>
      </dl>

      <div className="mt-5 flex items-center justify-between border-t border-black/10 pt-5">
        <span className={`${inter.className} text-base font-bold text-[#121212]`}>
          Total
        </span>
        <span className={`${inter.className} text-2xl font-bold text-[#121212]`}>
          {formatPrice(total, currency)}
        </span>
      </div>
    </div>
  );
}
