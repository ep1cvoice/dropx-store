"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { Heart } from "lucide-react";

import Button from "@/components/ui/Button";
import { useStoreBag } from "@/components/providers/StoreBagProvider";
import { formatPrice } from "@/lib/currency";
import { inter } from "@/lib/fonts";
import type { WishlistDisplayItem } from "@/lib/wishlist";

export default function WishlistGrid({
  items,
}: {
  items: WishlistDisplayItem[];
}) {
  const { removeWishlistItem } = useStoreBag();
  const [list, setList] = useState(items);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setList(items);
  }, [items]);

  function remove(variantId: string) {
    setList((prev) => prev.filter((i) => i.variantId !== variantId));
    startTransition(async () => {
      await removeWishlistItem(variantId);
    });
  }

  if (list.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-16 text-center">
        <p className={`${inter.className} text-base text-[#666666]`}>
          Your wishlist is empty.
        </p>
        <Link href="/browse-all">
          <Button
            variant="accent"
            className="h-12 rounded-none px-8 text-sm font-semibold uppercase tracking-[0.12em]"
          >
            Discover sneakers
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {list.map((item) => (
        <article
          key={item.variantId}
          className="group relative flex flex-col overflow-hidden rounded-none bg-white shadow-sm ring-1 ring-black/5"
        >
          <button
            type="button"
            onClick={() => remove(item.variantId)}
            disabled={isPending}
            aria-label={`Remove ${item.name} from wishlist`}
            className="absolute right-3 top-3 z-10 cursor-pointer rounded-none p-1 transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Heart size={20} className="fill-[#e85d2a] stroke-[#e85d2a]" />
          </button>

          <Link
            href={`/products/${item.slug}`}
            className="relative block aspect-square w-full overflow-hidden rounded-none bg-[#f5f5f5]"
          >
            {item.imageUrl && (
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}
          </Link>

          <Link
            href={`/products/${item.slug}`}
            className={`${inter.className} flex flex-col gap-1 px-3 pb-3 pt-3`}
          >
            <span className="text-[11px] font-semibold uppercase tracking-[1.5px] text-[#666666]">
              {item.brand}
            </span>
            <span className="text-[15px] font-medium leading-tight text-[#1a1a1a]">
              {item.name}
            </span>
            <span className="mt-1 text-base font-bold text-[#1a1a1a]">
              {formatPrice(item.price, item.currency)}
            </span>
          </Link>
        </article>
      ))}
    </div>
  );
}
