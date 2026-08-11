"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Check, Heart, RotateCcw, ShieldCheck, Truck, X } from "lucide-react";

import Link from "next/link";

import { addToCart } from "@/actions/cart";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import SizeButton from "@/components/ui/SizeButton";
import ProductDropCountdown from "@/components/product/ProductDropCountdown";
import StarRating from "@/components/product/StarRating";
import { useStoreBag } from "@/components/providers/StoreBagProvider";
import { isUpcoming } from "@/lib/availability";
import { formatPrice, listPriceFromSale } from "@/lib/currency";
import { anton, inter } from "@/lib/fonts";
import { GENDER_FILTERS } from "@/lib/listing";
import type { ProductDetail } from "@/types/product";
import type { ReviewSummary } from "@/types/review";

const LOW_STOCK_THRESHOLD = 5;

const GENDER_LABEL =
  Object.fromEntries(GENDER_FILTERS.map((g) => [g.value, g.label])) as Record<
    ProductDetail["gender"],
    string
  >;

const TRUST_POINTS = [
  { icon: Truck, label: "Free shipping on orders over €200" },
  { icon: RotateCcw, label: "30-day free returns" },
  { icon: ShieldCheck, label: "100% authentic guaranteed" },
] as const;

function resolveInitialVariantId(
  product: ProductDetail,
  preferredVariantId?: string,
) {
  if (
    preferredVariantId &&
    product.variants.some((v) => v.id === preferredVariantId)
  ) {
    return preferredVariantId;
  }
  return product.variants[0]?.id ?? "";
}

type ProductDetailViewProps = {
  product: ProductDetail;
  /** Prefill colourway from listing filters (`?variant=`). */
  initialVariantId?: string;
  reviewSummary?: ReviewSummary;
};

export default function ProductDetailView({
  product,
  initialVariantId,
  reviewSummary,
}: ProductDetailViewProps) {
  const router = useRouter();
  const { isWishlisted, toggleWishlistItem, bumpCartCount } = useStoreBag();
  const [selectedVariantId, setSelectedVariantId] = useState(() =>
    resolveInitialVariantId(product, initialVariantId),
  );
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!sizeGuideOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSizeGuideOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [sizeGuideOpen]);

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

  const upcoming = isUpcoming(product.availableAt);
  const canAddToCart = Boolean(
    !upcoming && selectedSize && selectedSize.stock > 0,
  );
  const onSale =
    product.badge === "discount" && product.discountValue != null;
  const compareAt =
    onSale && product.discountValue != null
      ? listPriceFromSale(price, product.discountValue)
      : null;

  const wishlisted = selectedVariant
    ? isWishlisted(selectedVariant.id)
    : false;

  const description =
    selectedVariant?.description ?? product.description;

  function handleWishlist() {
    if (!selectedVariant) return;
    const variantId = selectedVariant.id;
    startTransition(async () => {
      await toggleWishlistItem(variantId);
    });
  }

  function selectVariant(id: string) {
    setSelectedVariantId(id);
    setSelectedSizeId(null);
    setAdded(false);
    setError(null);
  }

  function handleAddToCart() {
    if (!canAddToCart || !selectedSize) return;
    setError(null);
    startTransition(async () => {
      const result = await addToCart(selectedSize.id, 1);
      if (result.ok) {
        bumpCartCount(1);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 2000);
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      {/* ---------------------------------------------------------------- */}
      {/* Gallery */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex flex-col gap-3">
        {product.heroImageUrl && (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-none bg-[#f5f5f5]">
            <Image
              src={product.heroImageUrl}
              alt={`${product.brand} ${product.name} campaign`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        )}

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
                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-none bg-white ring-1 transition-colors md:h-20 md:w-20 ${
                      active
                        ? "ring-2 ring-[#121212]"
                        : "ring-black/10 hover:ring-black/25"
                    }`}
                  >
                    {variant.imageUrl && (
                      <Image
                        src={variant.imageUrl}
                        alt={variant.color}
                        fill
                        sizes="80px"
                        className="object-contain p-1 cursor-pointer"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <div className="relative aspect-square flex-1 overflow-hidden rounded-none border border-black/10 bg-white">
            {selectedVariant?.imageUrl && (
              <Image
                src={selectedVariant.imageUrl}
                alt={`${product.name} — ${selectedVariant.color}`}
                fill
                priority={!product.heroImageUrl}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-4"
              />
            )}

            {(upcoming || product.badge) && (
              <div className="absolute left-3 top-3">
                {upcoming ? (
                  <Badge variant="upcoming" />
                ) : product.badge === "discount" &&
                  product.discountValue != null ? (
                  <Badge
                    variant="discount"
                    discountValue={product.discountValue}
                  />
                ) : product.badge && product.badge !== "discount" ? (
                  <Badge variant={product.badge} />
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Info panel */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex flex-col">
        <div
          className={`${inter.className} flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#666666]`}
        >
          <span>{product.brand}</span>
          <span aria-hidden className="text-[#cccccc]">
            ·
          </span>
          <span>{GENDER_LABEL[product.gender]}</span>
        </div>

        <h1
          className={`${anton.className} mt-2 text-4xl uppercase leading-[0.95] tracking-wide text-[#121212] md:text-5xl`}
        >
          {product.name}
        </h1>

        {reviewSummary && reviewSummary.count > 0 ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StarRating value={reviewSummary.average} size={16} />
            <span
              className={`${inter.className} text-sm font-semibold text-[#121212]`}
            >
              {reviewSummary.average.toFixed(1)}
            </span>
            <span className={`${inter.className} text-sm text-[#888888]`}>
              ({reviewSummary.count})
            </span>
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap items-baseline gap-2.5">
            {compareAt != null && (
              <span
                className={`${inter.className} text-lg font-medium text-[#999999] line-through`}
              >
                {formatPrice(compareAt, product.currency)}
              </span>
            )}
            <span
              className={`${inter.className} text-2xl font-bold ${
                compareAt != null ? "text-[#e85d2a]" : "text-[#121212]"
              }`}
            >
              {formatPrice(price, product.currency)}
            </span>
          </div>
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

        {upcoming && product.availableAt ? (
          <ProductDropCountdown
            availableAt={product.availableAt}
            variant="detail"
          />
        ) : stockMessage ? (
          <p
            className={`${inter.className} mt-2 text-sm font-medium ${
              relevantStock === 0 ? "text-[#666666]" : "text-[#e85d2a]"
            }`}
          >
            {stockMessage}
          </p>
        ) : null}

        {description && (
          <p
            className={`${inter.className} mt-5 max-w-prose text-sm leading-relaxed text-[#555555]`}
          >
            {description}
          </p>
        )}

        {/* Size selector — locked for upcoming drops */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <span
              className={`${inter.className} text-xs font-semibold uppercase tracking-[0.16em] text-[#121212]`}
            >
              Select size (EU)
            </span>
            <button
              type="button"
              onClick={() => setSizeGuideOpen(true)}
              className={`${inter.className} cursor-pointer text-xs font-semibold uppercase tracking-[0.16em] text-[#e85d2a] underline-offset-4 transition-all hover:underline hover:opacity-80`}
            >
              Size guide
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {selectedVariant?.sizes.map((size) => (
              <SizeButton
                key={size.id}
                size={size.size.replace(/^EU\s*/i, "")}
                available={!upcoming && size.stock > 0}
                selected={size.id === selectedSizeId}
                onClick={() => {
                  if (upcoming) return;
                  setSelectedSizeId(size.id);
                }}
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
                    className={`h-7 w-7 cursor-pointer rounded-none border border-black/15 transition-transform hover:scale-110 hover:ring-2 hover:ring-[#121212]/40 hover:ring-offset-1 ${
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
          {upcoming ? (
            <Link href="/#newsletter" className="flex-1">
              <Button
                variant="accent"
                className="h-14 w-full cursor-pointer rounded-none text-sm font-semibold uppercase tracking-[0.14em]"
              >
                Notify me
              </Button>
            </Link>
          ) : (
            <Button
              variant="accent"
              onClick={handleAddToCart}
              disabled={!canAddToCart || isPending}
              className="h-14 flex-1 cursor-pointer rounded-none text-sm font-semibold uppercase tracking-[0.14em]"
            >
              {added ? (
                <>
                  <Check size={18} /> Added to cart
                </>
              ) : isPending ? (
                "Adding…"
              ) : selectedSize ? (
                "Add to cart"
              ) : (
                "Select a size"
              )}
            </Button>
          )}

          <button
            type="button"
            onClick={handleWishlist}
            disabled={isPending}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={wishlisted}
            className="flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-none border border-gray-200 transition-colors hover:border-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
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

        {error && (
          <p
            className={`${inter.className} mt-3 text-sm font-medium text-[#e85d2a]`}
          >
            {error}
          </p>
        )}

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

      {sizeGuideOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6">
          <button
            type="button"
            aria-label="Close size guide"
            onClick={() => setSizeGuideOpen(false)}
            className="absolute inset-0 cursor-pointer bg-black/70"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="size-guide-title"
            className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-auto bg-white shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
          >
            <button
              type="button"
              onClick={() => setSizeGuideOpen(false)}
              aria-label="Close"
              className="absolute right-2 top-2 z-20 flex h-9 w-9 cursor-pointer items-center justify-center bg-black/80 text-white transition-colors hover:bg-black"
            >
              <X className="h-4 w-4" strokeWidth={2.2} />
            </button>
            <h2 id="size-guide-title" className="sr-only">
              Size guide
            </h2>
            <Image
              src="/size-guide.jpg"
              alt="Mens and womens sneaker size conversion chart"
              width={1200}
              height={1600}
              className="h-auto w-full"
              sizes="(max-width: 768px) 92vw, 768px"
            />
          </div>
        </div>
      )}
    </div>
  );
}
