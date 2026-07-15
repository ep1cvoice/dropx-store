"use client";

import Image from "next/image";
import { X } from "lucide-react";

import QuantitySelector from "@/components/ui/QuantitySelector";
import { inter, anton } from "@/lib/fonts";
import type { CartItem as CartItemType } from "@/types/cart";

const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
};

type CartItemProps = {
  item: CartItemType;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
};

export default function CartItem({
  item,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  const lineTotal = (item.price * item.quantity).toFixed(2);
  const symbol = CURRENCY_SYMBOLS[item.currency] ?? item.currency;

  return (
    <li className="flex items-center gap-4 border-b border-white/8 py-4">

      {/* Product image */}
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#f0f4ff]">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full" />
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p
          className={`${inter.className} text-[10px] font-semibold uppercase tracking-widest text-white/40`}
        >
          {item.brand}
        </p>
        <p
          className={`${anton.className} truncate text-sm tracking-wide text-white`}
        >
          {item.name}
        </p>
        <p className={`${inter.className} mt-0.5 text-xs text-white/40`}>
          Size: {item.size}&nbsp;·&nbsp;{item.color}
        </p>
      </div>

      {/* Right side: quantity + price + remove */}
      <div className="flex shrink-0 items-center gap-3">
        <QuantitySelector
          value={item.quantity}
          onChange={(qty) => onQuantityChange(item.id, qty)}
          min={1}
          max={item.maxStock}
        />

        <span
          className={`${inter.className} w-16 text-right text-sm font-semibold text-white`}
        >
          {symbol}{lineTotal}
        </span>

        <button
          type="button"
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${item.name} from cart`}
          className="flex h-7 w-7 items-center justify-center rounded-md text-white/30 transition-colors hover:bg-white/8 hover:text-white/70"
        >
          <X size={15} />
        </button>
      </div>
    </li>
  );
}
