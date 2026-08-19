"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { X } from "lucide-react";

import QuantitySelector from "@/components/ui/QuantitySelector";
import { removeCartItem, updateCartItemQuantity } from "@/actions/cart";
import { useStoreBag } from "@/components/providers/StoreBagProvider";
import { formatPrice } from "@/lib/currency";
import { anton, inter } from "@/lib/fonts";
import type { CartItem } from "@/types/cart";

type CartLineItemProps = {
  item: CartItem;
};

export default function CartLineItem({ item }: CartLineItemProps) {
  const router = useRouter();
  const { bumpCartCount } = useStoreBag();
  const [isPending, startTransition] = useTransition();

  const lineTotal = formatPrice(item.price * item.quantity, item.currency);

  function changeQuantity(quantity: number) {
    const delta = quantity - item.quantity;
    startTransition(async () => {
      const result = await updateCartItemQuantity(item.id, quantity);
      if (result.ok) {
        bumpCartCount(delta);
        router.refresh();
      }
    });
  }

  function remove() {
    startTransition(async () => {
      const result = await removeCartItem(item.id);
      if (result.ok) {
        bumpCartCount(-(result.removedQuantity ?? item.quantity));
        router.refresh();
      }
    });
  }

  return (
    <li
      className={`min-w-0 border-b border-black/10 py-5 ${
        isPending ? "pointer-events-none opacity-50" : ""
      }`}
    >
      <div className="flex min-w-0 items-start gap-3 sm:gap-4 md:items-center md:gap-6">
        <Link
          href={`/products/${item.slug}`}
          className="relative h-16 w-16 shrink-0 overflow-hidden rounded-none bg-white ring-1 ring-black/5 sm:h-20 sm:w-20"
        >
          {item.imageUrl && (
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              sizes="80px"
              className="object-contain p-1"
            />
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p
                className={`${inter.className} text-[10px] font-semibold uppercase tracking-[0.2em] text-[#999999]`}
              >
                {item.brand}
              </p>
              <p
                className={`${anton.className} truncate text-sm uppercase tracking-wide text-[#121212] sm:text-base`}
              >
                {item.name}
              </p>
              <p className={`${inter.className} mt-0.5 truncate text-xs text-[#777777]`}>
                {item.size}&nbsp;·&nbsp;{item.color}
              </p>
            </div>

            <button
              type="button"
              onClick={remove}
              aria-label={`Remove ${item.name} from cart`}
              className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-none text-[#bbbbbb] transition-colors hover:bg-black/5 hover:text-[#121212] md:hidden"
            >
              <X size={16} />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 md:mt-0 md:hidden">
            <p className={`${inter.className} text-sm font-semibold text-[#121212]`}>
              {lineTotal}
            </p>
            <QuantitySelector
              value={item.quantity}
              onChange={changeQuantity}
              min={1}
              max={item.maxStock}
              size="sm"
            />
          </div>
        </div>

        <div className="hidden shrink-0 items-center gap-6 md:flex">
          <QuantitySelector
            value={item.quantity}
            onChange={changeQuantity}
            min={1}
            max={item.maxStock}
          />
          <span
            className={`${inter.className} w-24 text-right text-sm font-semibold text-[#121212]`}
          >
            {lineTotal}
          </span>
          <button
            type="button"
            onClick={remove}
            aria-label={`Remove ${item.name} from cart`}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-none text-[#bbbbbb] transition-colors hover:bg-black/5 hover:text-[#121212]"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </li>
  );
}
