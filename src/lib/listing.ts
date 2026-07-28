import type {
  GenderFilter,
  ProductCardData,
  ProductCategory,
} from "@/types/product";

// Client-safe listing constants and types (no Prisma import), so both the
// server query layer (catalog.ts) and client filter components can use them.

export type SortOption = "newest" | "price-asc" | "price-desc";
export type CollectionSlug = "browse-all" | "new-drops" | "featured" | "sale";
export type { GenderFilter, ProductCategory };

export const GENDER_FILTERS: { value: GenderFilter; label: string }[] = [
  { value: "men", label: "Male" },
  { value: "women", label: "Female" },
  { value: "unisex", label: "Unisex" },
];

export const CATEGORY_FILTERS: { value: ProductCategory; label: string }[] = [
  { value: "running", label: "Running" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "basketball", label: "Basketball" },
  { value: "skateboarding", label: "Skate" },
];

export const COLLECTIONS: { slug: CollectionSlug; label: string }[] = [
  { slug: "browse-all", label: "Browse All" },
  { slug: "new-drops", label: "New Drops" },
  { slug: "featured", label: "Featured Picks" },
  { slug: "sale", label: "On Sale" },
];

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

/** Colour swatches shown in the sidebar; `family` matches ProductVariant.colorFamily. */
export const COLOR_FILTERS: { family: string; label: string; hex: string }[] = [
  { family: "black", label: "Black", hex: "#1A1A1A" },
  { family: "white", label: "White", hex: "#FFFFFF" },
  { family: "grey", label: "Grey", hex: "#9CA3AF" },
  { family: "red", label: "Red", hex: "#DC2626" },
  { family: "blue", label: "Blue", hex: "#2563EB" },
  { family: "green", label: "Green", hex: "#16A34A" },
  { family: "orange", label: "Orange", hex: "#EA580C" },
];

/** EU sizes offered as filter chips (bare numbers; stored as "EU 40"). */
export const SIZE_FILTERS = [
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
  "47",
];

export const PRICE_BOUNDS = { min: 0, max: 300 };

export function isCollectionSlug(
  value: string | undefined,
): value is CollectionSlug {
  return COLLECTIONS.some((c) => c.slug === value);
}

export function isSortOption(value: string | undefined): value is SortOption {
  return SORT_OPTIONS.some((s) => s.value === value);
}

export function isGenderFilter(
  value: string | undefined,
): value is GenderFilter {
  return GENDER_FILTERS.some((g) => g.value === value);
}

export function isProductCategory(
  value: string | undefined,
): value is ProductCategory {
  return CATEGORY_FILTERS.some((c) => c.value === value);
}

export type BrandFacet = { slug: string; name: string; count: number };

export type ProductListingResult = {
  products: ProductCardData[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  brandFacets: BrandFacet[];
};
