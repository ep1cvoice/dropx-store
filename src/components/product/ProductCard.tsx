"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useState } from "react";

import Badge from "@/components/ui/Badge";
import { inter, anton } from "@/lib/fonts";
import type { ProductCardData } from "@/types/product";

type ProductCardProps = {
  product: ProductCardData;
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
};

function formatPrice(price: number, currency: string): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
  return `${symbol}${price.toFixed(2)}`;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md">

      {/* ------------------------------------------------------------------ */}
      {/* Image area                                                           */}
      {/* ------------------------------------------------------------------ */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square w-full overflow-hidden bg-[#f5f5f5]"
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

        {/* Badge — top-left */}
        {product.badge && (
          <div className="absolute left-3 top-3">
            {product.badge === "discount" && product.discountValue != null ? (
              <Badge variant="discount" discountValue={product.discountValue} />
            ) : (
              <Badge variant={product.badge} />
            )}
          </div>
        )}
      </Link>

      {/* Wishlist button — top-right, overlaid on image */}
      <button
        type="button"
        onClick={() => setWishlisted((prev) => !prev)}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-colors hover:bg-white"
      >
        <Heart
          size={16}
          className={
            wishlisted
              ? "fill-[#e85d2a] stroke-[#e85d2a]"
              : "stroke-gray-500 fill-none"
          }
        />
      </button>

      {/* ------------------------------------------------------------------ */}
      {/* Info area                                                            */}
      {/* Color picker and size selector live on the product details page.    */}
      {/* ------------------------------------------------------------------ */}
      <Link
        href={`/products/${product.slug}`}
        className="flex flex-col gap-1 px-3 pb-3 pt-2.5"
      >
        {/* Brand */}
        <span
          className={`${inter.className} text-[10px] font-semibold uppercase tracking-widest text-gray-400`}
        >
          {product.brand}
        </span>

        {/* Product name */}
        <span
          className={`${anton.className} text-base leading-tight tracking-wide text-[#121212]`}
        >
          {product.name}
        </span>

        {/* Price */}
        <span
          className={`${inter.className} mt-1 text-sm font-semibold text-[#121212]`}
        >
          {formatPrice(product.priceFrom, product.currency)}
        </span>
      </Link>
    </article>
  );
}
