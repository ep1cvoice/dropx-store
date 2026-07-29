/** Static newsletter member promo — same code for every eligible user. */
export const MEMBER_PROMO_CODE = "MEMBER10";
export const MEMBER_PROMO_PERCENT = 10;
export const MEMBER_PROMO_MIN_SUBTOTAL = 400;

export const PROMO_COOKIE = "dropx_promo_code";
const PROMO_COOKIE_MAX_AGE = 60 * 60 * 24 * 14; // 14 days

export function normalizePromoCode(code: string): string {
  return code.trim().toUpperCase();
}

/** 10% of subtotal when at/above the €400 threshold; otherwise 0. */
export function memberDiscountAmount(subtotal: number): number {
  if (subtotal < MEMBER_PROMO_MIN_SUBTOTAL) return 0;
  return Math.round(subtotal * (MEMBER_PROMO_PERCENT / 100) * 100) / 100;
}

export function isMemberPromoCode(code: string): boolean {
  return normalizePromoCode(code) === MEMBER_PROMO_CODE;
}

export { PROMO_COOKIE_MAX_AGE };
