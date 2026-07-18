"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, Heart, RotateCcw, ShieldCheck, Truck } from "lucide-react";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import SizeButton from "@/components/ui/SizeButton";
import { anton, inter } from "@/lib/fonts";
import type { ProductDetail } from "@/types/product";

const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
};

const LOW_STOCK_THRESHOLD = 5;

function formatPrice(price: number, currency: string): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
  return `${symbol}${price.toFixed(2)}`;
}

const TRUST_POINTS = [
  { icon: Truck, label: "Free shipping on orders over €100" },
  { icon: RotateCcw, label: "30-day free returns" },
  { icon: ShieldCheck, label: "100% authentic guaranteed" },
] as const;

type ProductDetailViewProps = {
  product: ProductDetail;
};

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0]?.id ?? "",
  );
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) ??
    product.variants[0];

  const selectedSize =
    selectedVariant?.sizes.find((s) => s.id === selectedSizeId) ?? null;

  const price = selectedVariant?.price ?? 0;

  const relevantStock = selectedSize
    ? selectedSize.stock
    : (selectedVariant?.sizes.reduce((sum, s) => sum + s.stock, 0) ?? 0);

  const stockMessage =
    relevantStock === 0
      ? "Out of stock"
      : relevantStock <= LOW_STOCK_THRESHOLD
        ? `Only ${relevantStock} left in stock — order soon`
        : null;

  const canAddToCart = Boolean(selectedSize && selectedSize.stock > 0);

  function selectVariant(id: string) {
    setSelectedVariantId(id);
    setSelectedSizeId(null);
    setAdded(false);
  }

  function handleAddToCart() {
    if (!canAddToCart) return;
    // TODO(cart): persist via server action once the cart backend lands.
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      {/* ---------------------------------------------------------------- */}
      {/* Gallery */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex gap-3 md:gap-4">
        {product.variants.length > 1 && (
          <div className="flex flex-col gap-3">
            {product.variants.map((variant) => {
              const active = variant.id === selectedVariant?.id;
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => selectVariant(variant.id)}
                  aria-label={`View ${variant.color}`}
                  aria-pressed={active}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-[#f5f5f5] ring-1 transition-colors md:h-20 md:w-20 ${
                    active ? "ring-2 ring-[#121212]" : "ring-black/10 hover:ring-black/30"
                  }`}
                >
                  {variant.imageUrl && (
                    <Image
                      src={variant.imageUrl}
                      alt={variant.color}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}

        <div className="relative aspect-square flex-1 overflow-hidden rounded-lg bg-[#f5f5f5]">
          {selectedVariant?.imageUrl && (
            <Image
              src={selectedVariant.imageUrl}
              alt={`${product.name} — ${selectedVariant.color}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
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
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Info panel */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex flex-col">
        <span
          className={`${inter.className} text-xs font-semibold uppercase tracking-[0.2em] text-[#666666]`}
        >
          {product.brand}
        </span>

        <h1
          className={`${anton.className} mt-2 text-4xl uppercase leading-[0.95] tracking-wide text-[#121212] md:text-5xl`}
        >
          {product.name}
        </h1>

        <div className="mt-4 flex items-center gap-3">
          <span
            className={`${inter.className} text-2xl font-bold text-[#121212]`}
          >
            {formatPrice(price, product.currency)}
          </span>
          {product.badge && (
            <>
              {product.badge === "discount" && product.discountValue != null ? (
                <Badge variant="discount" discountValue={product.discountValue} />
              ) : product.badge !== "discount" ? (
                <Badge variant={product.badge} />
              ) : null}
            </>
          )}
        </div>

        {stockMessage && (
          <p
            className={`${inter.className} mt-2 text-sm font-medium ${
              relevantStock === 0 ? "text-[#666666]" : "text-[#e85d2a]"
            }`}
          >
            {stockMessage}
          </p>
        )}

        {product.description && (
          <p
            className={`${inter.className} mt-5 max-w-prose text-sm leading-relaxed text-[#555555]`}
          >
            {product.description}
          </p>
        )}

        {/* Size selector */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <span
              className={`${inter.className} text-xs font-semibold uppercase tracking-[0.16em] text-[#121212]`}
            >
              Select size (EU)
            </span>
            <button
              type="button"
              className={`${inter.className} text-xs font-semibold uppercase tracking-[0.16em] text-[#e85d2a] transition-opacity hover:opacity-70`}
            >
              Size guide
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {selectedVariant?.sizes.map((size) => (
              <SizeButton
                key={size.id}
                size={size.size.replace(/^EU\s*/i, "")}
                available={size.stock > 0}
                selected={size.id === selectedSizeId}
                onClick={() => setSelectedSizeId(size.id)}
              />
            ))}
          </div>
        </div>

        {/* Colour swatches */}
        {product.variants.length > 0 && (
          <div className="mt-6">
            <span
              className={`${inter.className} text-xs font-semibold uppercase tracking-[0.16em] text-[#121212]`}
            >
              Color
            </span>
            <div className="mt-3 flex items-center gap-3">
              {product.variants.map((variant) => {
                const active = variant.id === selectedVariant?.id;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => selectVariant(variant.id)}
                    aria-label={variant.color}
                    aria-pressed={active}
                    title={variant.color}
                    className={`h-7 w-7 rounded-full border border-black/15 transition-transform hover:scale-110 ${
                      active ? "ring-2 ring-[#121212] ring-offset-2" : ""
                    }`}
                    style={{ backgroundColor: variant.colorHex }}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex items-stretch gap-3">
          <Button
            variant="accent"
            onClick={handleAddToCart}
            disabled={!canAddToCart}
            className="h-14 flex-1 cursor-pointer rounded-md text-sm font-semibold uppercase tracking-[0.14em]"
          >
            {added ? (
              <>
                <Check size={18} /> Added to cart
              </>
            ) : selectedSize ? (
              "Add to cart"
            ) : (
              "Select a size"
            )}
          </Button>

          <button
            type="button"
            onClick={() => setWishlisted((prev) => !prev)}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={wishlisted}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border border-gray-200 transition-colors hover:border-gray-400"
          >
            <Heart
              size={20}
              className={
                wishlisted
                  ? "fill-[#e85d2a] stroke-[#e85d2a]"
                  : "fill-none stroke-[#1a1a1a]"
              }
            />
          </button>
        </div>

        {/* Trust points */}
        <ul className="mt-8 space-y-3 border-t border-black/10 pt-6">
          {TRUST_POINTS.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className={`${inter.className} flex items-center gap-3 text-sm text-[#555555]`}
            >
              <Icon size={18} className="shrink-0 text-[#121212]" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
