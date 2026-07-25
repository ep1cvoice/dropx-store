"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { X } from "lucide-react";

import QuantitySelector from "@/components/ui/QuantitySelector";
import { removeCartItem, updateCartItemQuantity } from "@/actions/cart";
import { formatPrice } from "@/lib/currency";
import { anton, inter } from "@/lib/fonts";
import type { CartItem } from "@/types/cart";

type CartLineItemProps = {
  item: CartItem;
};

export default function CartLineItem({ item }: CartLineItemProps) {
  const [isPending, startTransition] = useTransition();

  const lineTotal = formatPrice(item.price * item.quantity, item.currency);

  function changeQuantity(quantity: number) {
    startTransition(async () => {
      await updateCartItemQuantity(item.id, quantity);
    });
  }

  function remove() {
    startTransition(async () => {
      await removeCartItem(item.id);
    });
  }

  return (
    <li
      className={`flex items-start gap-4 border-b border-black/10 py-5 md:items-center md:gap-6 ${
        isPending ? "pointer-events-none opacity-50" : ""
      }`}
    >
      <Link
        href={`/products/${item.slug}`}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[#eef4ff]"
      >
        {item.imageUrl && (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <p
          className={`${inter.className} text-[10px] font-semibold uppercase tracking-[0.2em] text-[#999999]`}
        >
          {item.brand}
        </p>
        <p
          className={`${anton.className} truncate text-base uppercase tracking-wide text-[#121212]`}
        >
          {item.name}
        </p>
        <p className={`${inter.className} mt-0.5 text-xs text-[#777777]`}>
          {item.size}&nbsp;·&nbsp;{item.color}
        </p>

        <p
          className={`${inter.className} mt-2 text-sm font-semibold text-[#121212] md:hidden`}
        >
          {lineTotal}
        </p>
      </div>

      <div className="flex flex-col items-end gap-3 md:flex-row md:items-center md:gap-6">
        <button
          type="button"
          onClick={remove}
          aria-label={`Remove ${item.name} from cart`}
          className="flex h-7 w-7 items-center justify-center rounded-md text-[#bbbbbb] transition-colors hover:bg-black/5 hover:text-[#121212] md:order-3"
        >
          <X size={16} />
        </button>

        <div className="md:order-1">
          <QuantitySelector
            value={item.quantity}
            onChange={changeQuantity}
            min={1}
            max={item.maxStock}
          />
        </div>

        <span
          className={`${inter.className} hidden w-24 text-right text-sm font-semibold text-[#121212] md:order-2 md:block`}
        >
          {lineTotal}
        </span>
      </div>
    </li>
  );
}
