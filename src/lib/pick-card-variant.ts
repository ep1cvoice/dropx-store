/**
 * Prefer a colourway that matches active color filters (filter order wins),
 * otherwise the first variant by creation order.
 */
export function pickCardVariant<T extends { colorFamily: string }>(
  variants: T[],
  preferredColorFamilies?: string[],
): T | null {
  if (variants.length === 0) return null;
  if (preferredColorFamilies?.length) {
    for (const family of preferredColorFamilies) {
      const match = variants.find((v) => v.colorFamily === family);
      if (match) return match;
    }
  }
  return variants[0] ?? null;
}
