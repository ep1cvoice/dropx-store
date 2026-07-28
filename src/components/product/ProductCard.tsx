"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useTransition } from "react";

import Badge from "@/components/ui/Badge";
import { useStoreBag } from "@/components/providers/StoreBagProvider";
import { formatPrice } from "@/lib/currency";
import { inter } from "@/lib/fonts";
import type { ProductCardData } from "@/types/product";

type ProductCardProps = {
  product: ProductCardData;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { isWishlisted, toggleWishlistItem } = useStoreBag();
  const [isPending, startTransition] = useTransition();
  const wishlisted = Boolean(
    product.variantId && isWishlisted(product.variantId),
  );

  function handleWishlist(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (!product.variantId) return;
    startTransition(async () => {
      await toggleWishlistItem(product.variantId);
    });
  }

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-none bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square w-full overflow-hidden rounded-none bg-[#f5f5f5]"
        tabIndex={-1}
        aria-hidden="true"
      >
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg
              className="h-16 w-16 text-gray-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}

        {product.badge && (
          <div className="absolute left-3 top-3">
            {product.badge === "discount" && product.discountValue != null ? (
              <Badge variant="discount" discountValue={product.discountValue} />
            ) : product.badge !== "discount" ? (
              <Badge variant={product.badge} />
            ) : null}
          </div>
        )}
      </Link>

      <button
        type="button"
        onClick={handleWishlist}
        disabled={isPending || !product.variantId}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={wishlisted}
        className="absolute right-3 top-3 z-10 cursor-pointer rounded-none p-1 transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Heart
          size={20}
          className={
            wishlisted
              ? "fill-[#e85d2a] stroke-[#e85d2a]"
              : "fill-none stroke-[#1A1A1A]"
          }
        />
      </button>

      <Link
        href={`/products/${product.slug}`}
        className="flex flex-col gap-1 px-3 pb-3 pt-3"
      >
        <span
          className={`${inter.className} text-[11px] font-semibold uppercase tracking-[1.5px] text-[#666666]`}
        >
          {product.brand}
        </span>

        <span
          className={`${inter.className} text-[15px] font-medium leading-tight text-[#1A1A1A]`}
        >
          {product.name}
        </span>

        <div className="mt-1 flex items-center justify-between">
          <span className={`${inter.className} text-base font-bold text-[#1A1A1A]`}>
            {formatPrice(product.priceFrom, product.currency)}
          </span>
          {product.stockText && (
            <span className={`${inter.className} text-[11px] font-medium text-[#FF4D00]`}>
              {product.stockText}
            </span>
          )}
        </div>
      </Link>
    </article>
  );
}
