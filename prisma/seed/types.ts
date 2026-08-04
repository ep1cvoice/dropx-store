/**
 * Shared seed types, brands, stock helpers, and Unsplash fallback images.
 */
import { SIZE_RUNS } from "../../src/lib/sizes";
import { UPCOMING_DROP, UPCOMING_OFFSETS_DAYS } from "../../src/lib/upcoming-drop";

export { SIZE_RUNS };

const IMAGE_POOL = [
  "photo-1542291026-7eec264c27ff",
  "photo-1600185365483-26d7a4cc7519",
  "photo-1595950653106-6c9ebd614d3a",
  "photo-1606107557195-0e29a4b5b4aa",
  "photo-1608231387042-66d1773070a5",
  "photo-1552346154-21d32810aba3",
  "photo-1514989940723-e8e51635b782",
  "photo-1600269452121-4f2416e55c28",
  "photo-1549298916-b41d501d3772",
  "photo-1460353581641-37baddab0fa2",
  "photo-1595341888016-a392ef81b7de",
  "photo-1491553895911-0055eca6402d",
  "photo-1465453869711-7e174808ace9",
  "photo-1584735175315-9d5df23860e6",
  "photo-1539185441755-769473a23570",
];

export const img = (idx: number) =>
  `https://images.unsplash.com/${IMAGE_POOL[idx % IMAGE_POOL.length]}?auto=format&fit=crop&w=800&q=80`;

export type Category = "running" | "basketball" | "lifestyle" | "skateboarding";
export type Badge = "new" | "limited" | "discount" | null;
export type Gender = "men" | "women" | "unisex";
export type StockKind = "classic" | "drop" | "oos";

export type SeedVariant = {
  color: string;
  colorHex: string;
  colorFamily: string;
  /** Colourway-specific copy; falls back to product.description when omitted. */
  description?: string;
  price: number;
  image: number;
  /**
   * Legacy marker only — real size runs are built by `buildStock` from gender.
   * Pass `stockOos()` to force a sold-out product.
   */
  stock: Record<number, number>;
  /** Cloudinary public_id — when set, seed stores a Cloudinary URL instead of Unsplash. */
  cloudinaryId?: string;
};

export type SeedProduct = {
  slug: string;
  name: string;
  description: string;
  brand: string;
  category: Category;
  gender: Gender;
  badge: Badge;
  discountValue?: number;
  featured?: boolean;
  availableAt?: string;
  heroImageUrl?: string;
  variants: SeedVariant[];
};

export const BRANDS = [
  { name: "Nike", slug: "nike" },
  { name: "Adidas", slug: "adidas" },
  { name: "New Balance", slug: "new-balance" },
  { name: "ASICS", slug: "asics" },
  { name: "Puma", slug: "puma" },
  { name: "Converse", slug: "converse" },
] as const;

/** Deterministic 32-bit hash — same seed always yields the same stock pattern. */
function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function isAllZero(stock: Record<number, number>): boolean {
  const values = Object.values(stock);
  return values.length > 0 && values.every((n) => n === 0);
}

/**
 * Build a gender-correct size run with catalog-appropriate availability.
 * Classics: fuller stock, 0–2 random mid sizes OOS.
 * Drops: sparse low stock, several sizes OOS.
 */
export function buildStock(options: {
  gender: Gender;
  kind: StockKind;
  seed: string;
}): Record<number, number> {
  const { gender, kind, seed } = options;
  const sizes = SIZE_RUNS[gender];
  const h = hashSeed(seed);
  const stock: Record<number, number> = {};

  if (kind === "oos") {
    for (const eu of sizes) stock[eu] = 0;
    return stock;
  }

  for (let i = 0; i < sizes.length; i++) {
    const eu = sizes[i];
    const roll = (h + i * 17) % 100;

    if (kind === "classic") {
      // Base 5–12 units; zero ~1–2 mid sizes; occasional low stock.
      let qty = 5 + ((h + i * 13) % 8);
      if (i > 0 && i < sizes.length - 1 && roll < 18) qty = 0;
      else if (roll >= 18 && roll < 30) qty = Math.min(qty, 2);
      stock[eu] = qty;
    } else {
      // Drops: 0–3 units; many sizes empty.
      let qty = (h + i * 11) % 4; // 0–3
      if (roll < 45) qty = 0;
      else if (qty === 0) qty = 1;
      stock[eu] = qty;
    }
  }

  // Never leave a buyable classic/drop with zero available sizes.
  const inStock = sizes.filter((eu) => stock[eu] > 0);
  if (inStock.length === 0) {
    stock[sizes[h % sizes.length]] = kind === "classic" ? 6 : 2;
    stock[sizes[(h + 2) % sizes.length]] = kind === "classic" ? 4 : 1;
  } else if (kind === "drop" && inStock.length < 2) {
    const extra = sizes[(h + 3) % sizes.length];
    if (stock[extra] === 0) stock[extra] = 1;
  }

  return stock;
}

/** Resolve stock for a seeded variant (honours explicit sold-out markers). */
export function resolveVariantStock(
  product: SeedProduct,
  variant: SeedVariant,
  kind: Exclude<StockKind, "oos">,
): Record<number, number> {
  if (isAllZero(variant.stock)) {
    return buildStock({
      gender: product.gender,
      kind: "oos",
      seed: `${product.slug}:${variant.color}`,
    });
  }
  return buildStock({
    gender: product.gender,
    kind,
    seed: `${product.slug}:${variant.color}`,
  });
}

/** @deprecated Prefer `buildStock` — kept so existing seed files still typecheck. */
export function stockFull(base = 8): Record<number, number> {
  const stock: Record<number, number> = {};
  for (let eu = 38; eu <= 45; eu++) {
    const offset = (eu - 38) % 3;
    stock[eu] = Math.max(1, base + offset - 1);
  }
  return stock;
}

/** @deprecated Prefer `buildStock` — kept so existing seed files still typecheck. */
export function stockLimited(): Record<number, number> {
  return { 40: 1, 41: 2, 42: 1, 43: 1, 44: 0, 45: 0 };
}

/** Explicit sold-out marker — `resolveVariantStock` turns this into a full zero run. */
export function stockOos(): Record<number, number> {
  return { 41: 0, 42: 0, 43: 0, 44: 0 };
}

function plusDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString();
}

/** Resolve upcoming drop ISO date from shared homepage config offsets. */
export function upcomingAt(slug: keyof typeof UPCOMING_OFFSETS_DAYS): string {
  return plusDays(UPCOMING_DROP.dropsAt, UPCOMING_OFFSETS_DAYS[slug]);
}

export { UPCOMING_DROP };
