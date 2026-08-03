/**
 * Shared seed types, brands, stock helpers, and Unsplash fallback images.
 */
import { UPCOMING_DROP, UPCOMING_OFFSETS_DAYS } from "../../src/lib/upcoming-drop";

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

export type SeedVariant = {
  color: string;
  colorHex: string;
  colorFamily: string;
  price: number;
  image: number;
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

/** EU 38–45 with varying stock counts. */
export function stockFull(base = 8): Record<number, number> {
  const stock: Record<number, number> = {};
  for (let eu = 38; eu <= 45; eu++) {
    const offset = (eu - 38) % 3;
    stock[eu] = Math.max(1, base + offset - 1);
  }
  return stock;
}

/** Sparse low stock — some sizes at zero. */
export function stockLimited(): Record<number, number> {
  return { 40: 1, 41: 2, 42: 1, 43: 1, 44: 0, 45: 0 };
}

/** All zero for sizes 41–44. */
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
