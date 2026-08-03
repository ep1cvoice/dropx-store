"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useTransition } from "react";

import Badge from "@/components/ui/Badge";
import ProductDropCountdown from "@/components/product/ProductDropCountdown";
import { useStoreBag } from "@/components/providers/StoreBagProvider";
import { isUpcoming } from "@/lib/availability";
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
  const upcoming = isUpcoming(product.availableAt);
  const soldOut = product.outOfStock && !upcoming;

  function handleWishlist(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (!product.variantId) return;
    startTransition(async () => {
      await toggleWishlistItem(product.variantId);
    });
  }

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-none bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md ${
        soldOut ? "opacity-90" : ""
      }`}
    >
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/3] w-full overflow-hidden rounded-none bg-white"
        tabIndex={-1}
        aria-hidden="true"
      >
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className={`object-contain p-2 transition-transform duration-300 group-hover:scale-105 ${
              soldOut ? "grayscale blur-[1.5px] brightness-90" : ""
            }`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white">
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

        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/25">
            <Badge variant="soldOut" />
          </div>
        )}

        {upcoming && product.availableAt && (
          <ProductDropCountdown availableAt={product.availableAt} variant="card" />
        )}

        {!soldOut && !upcoming && product.badge && (
          <div className="absolute left-2 top-2">
            {product.badge === "discount" && product.discountValue != null ? (
              <Badge variant="discount" discountValue={product.discountValue} />
            ) : product.badge !== "discount" ? (
              <Badge variant={product.badge} />
            ) : null}
          </div>
        )}

        {upcoming && (
          <div className="absolute left-2 top-2">
            <Badge variant="limited" label="Upcoming" />
          </div>
        )}
      </Link>

      <button
        type="button"
        onClick={handleWishlist}
        disabled={isPending || !product.variantId || soldOut || upcoming}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={wishlisted}
        className="group/wish absolute right-2 top-2 z-10 cursor-pointer rounded-none p-1 transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Heart
          size={22}
          className={`transition-transform duration-200 group-hover/wish:scale-125 ${
            wishlisted
              ? "fill-[#e85d2a] stroke-[#e85d2a]"
              : "fill-none stroke-[#1A1A1A]"
          }`}
        />
      </button>

      <Link
        href={`/products/${product.slug}`}
        className="flex flex-col gap-1 px-2.5 pb-2.5 pt-2.5"
      >
        <span
          className={`${inter.className} text-[10px] font-semibold uppercase tracking-[1.5px] text-[#666666]`}
        >
          {product.brand}
        </span>

        <span
          className={`${inter.className} line-clamp-2 text-sm font-medium leading-tight text-[#1A1A1A]`}
        >
          {product.name}
        </span>

        <div className="mt-1 flex items-center justify-between gap-1">
          <span className={`${inter.className} text-sm font-bold text-[#1A1A1A]`}>
            {formatPrice(product.priceFrom, product.currency)}
          </span>
          {soldOut ? (
            <span className={`${inter.className} text-[10px] font-medium text-[#888888]`}>
              Sold out
            </span>
          ) : product.stockText ? (
            <span className={`${inter.className} text-[10px] font-medium text-[#FF4D00]`}>
              {product.stockText}
            </span>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
