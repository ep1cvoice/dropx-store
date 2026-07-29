import type { BadgeVariant } from "@/components/ui/Badge";

// ---------------------------------------------------------------------------
// Enums / constants
// ---------------------------------------------------------------------------

export type ProductCategory =
  | "running"
  | "basketball"
  | "lifestyle"
  | "skateboarding";

export type ProductGender = "men" | "women" | "unisex";

/** Listing gender filter — men/women also include unisex products. */
export type GenderFilter = ProductGender;

// ---------------------------------------------------------------------------
// VariantSize
// One row per EU size within a colorway.
// Keeping this relational (not JSON) enables:
//   - Size filtering on catalog pages
//   - Accurate stock checks before purchase
//   - Atomic stock decrements on order placement
//   - Admin inventory reports and low-stock alerts
//   - Order line items that reference a specific VariantSize by id
// ---------------------------------------------------------------------------
export type VariantSize = {
  id: string;
  variantId: string;
  size: string;   // EU sizing — e.g. "EU 38", "EU 39", ..., "EU 50"
  stock: number;
};

// ---------------------------------------------------------------------------
// ProductVariant
// One row per colorway (e.g. Air Max 90 — Triple White).
// Holds the color swatch, its own image and price, and all of its sizes.
// ---------------------------------------------------------------------------
export type ProductVariant = {
  id: string;
  productId: string;
  color: string;      // e.g. "Triple White"
  colorHex: string;   // e.g. "#F5F5F5" — rendered as the swatch dot
  imageUrl: string | null;
  price: number;
  sizes: VariantSize[];
  createdAt: Date;
  updatedAt: Date;
};

// ---------------------------------------------------------------------------
// Product
// The top-level catalog item. Badge and discount live here because they apply
// to the whole product line, not to a specific colorway.
// ---------------------------------------------------------------------------
export type Product = {
  id: string;
  slug: string;        // e.g. "air-max-90" → /products/air-max-90
  name: string;
  description: string | null;
  brand: string;
  category: ProductCategory;
  gender: ProductGender;
  badge: BadgeVariant | null;
  discountValue: number | null;
  currency: string;
  variants: ProductVariant[];
  createdAt: Date;
  updatedAt: Date;
};

// ---------------------------------------------------------------------------
// ProductDetail
// Full payload for the product details page (/products/[slug]).
// Currently identical to Product, but kept as a distinct name so the detail
// query and view can evolve (e.g. reviews, related media) without touching the
// base catalog type.
// ---------------------------------------------------------------------------
export type ProductDetail = Product;

// ---------------------------------------------------------------------------
// ProductCardData
// Lightweight projection for catalog / listing pages.
// Does NOT include variants or sizes — those are only fetched on the
// product details page, keeping list queries fast.
//
// Prisma query example:
//   prisma.product.findMany({
//     select: {
//       id: true, slug: true, name: true, brand: true,
//       badge: true, discountValue: true, currency: true,
//       variants: {
//         take: 1,
//         orderBy: { createdAt: "asc" },
//         select: { imageUrl: true, price: true },
//       },
//     },
//   })
//
// `imageUrl` and `priceFrom` are resolved from the first/cheapest variant
// before the data reaches the component.
// ---------------------------------------------------------------------------
export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  /** Default (first) variant id — used to toggle the wishlist from a card. */
  variantId: string;
  badge: BadgeVariant | null;
  discountValue: number | null;
  currency: string;
  /** Image of the default (first) variant — null until uploaded to Supabase */
  imageUrl: string | null;
  /** Lowest price across all variants — used for "From €X" display */
  priceFrom: number;
  /** True when every size across all variants has zero stock. */
  outOfStock: boolean;
  /** Short low-stock message shown beside price, e.g. "Only 3 left" */
  stockText?: string | null;
};
