import type { GenderFilter } from "@/types/product";

/**
 * Typical EU sneaker runs used for seeding stock and listing filters.
 * - Women: 36–42
 * - Men: 40–46
 * - Unisex: 38–45 (shared middle)
 */
export const SIZE_RUNS = {
  women: [36, 37, 38, 39, 40, 41, 42],
  men: [40, 41, 42, 43, 44, 45, 46],
  unisex: [38, 39, 40, 41, 42, 43, 44, 45],
} as const;

export type SizeGender = keyof typeof SIZE_RUNS;

const MEN_SIZE_SET = new Set(SIZE_RUNS.men.map(String));
const WOMEN_SIZE_SET = new Set(SIZE_RUNS.women.map(String));

/** True when every selected EU size belongs to that gender's typical run. */
export function sizesFitGender(
  gender: Exclude<GenderFilter, "unisex">,
  sizes: string[],
): boolean {
  if (sizes.length === 0) return true;
  const allowed = gender === "men" ? MEN_SIZE_SET : WOMEN_SIZE_SET;
  return sizes.every((size) => allowed.has(size));
}
