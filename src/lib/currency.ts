const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
};

export function currencySymbol(currency: string): string {
  return CURRENCY_SYMBOLS[currency] ?? currency;
}

export function formatPrice(price: number, currency: string): string {
  return `${currencySymbol(currency)}${price.toFixed(2)}`;
}

/** Orders at or above this subtotal ship for free (matches the storefront banner). */
export const FREE_SHIPPING_THRESHOLD = 100;

/** Flat shipping fee applied below the free-shipping threshold. */
export const STANDARD_SHIPPING_FEE = 4.95;

export function shippingFor(subtotal: number): number {
  if (subtotal <= 0 || subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return STANDARD_SHIPPING_FEE;
}
