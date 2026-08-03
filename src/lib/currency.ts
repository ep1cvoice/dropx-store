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

/**
 * Variant `price` is what the customer pays. When `discountValue` is set
 * (percent off), recover the pre-sale list price for strikethrough UI.
 */
export function listPriceFromSale(
  salePrice: number,
  discountPercent: number,
): number {
  if (discountPercent <= 0 || discountPercent >= 100) return salePrice;
  return salePrice / (1 - discountPercent / 100);
}

/** Free shipping kicks in at/above this subtotal. */
export const FREE_SHIPPING_THRESHOLD = 200;

/** Flat shipping fee below the free-shipping threshold. */
export const STANDARD_SHIPPING_FEE = 4.95;

/** Polish carriers — same delivery tier, user just picks how it ships. */
export const SHIPPING_CARRIERS = [
  {
    id: "inpost-paczkomat",
    label: "InPost Paczkomat",
    description: "Pick up from a parcel locker (1–2 business days)",
  },
  {
    id: "inpost-kurier",
    label: "InPost Kurier",
    description: "Courier delivery to your door (1–2 business days)",
  },
  {
    id: "dpd",
    label: "DPD",
    description: "Courier delivery (2–3 business days)",
  },
  {
    id: "dhl",
    label: "DHL Parcel",
    description: "Courier delivery (2–3 business days)",
  },
  {
    id: "poczta",
    label: "Poczta Polska",
    description: "Post office / home delivery (3–5 business days)",
  },
] as const;

export type ShippingCarrierId = (typeof SHIPPING_CARRIERS)[number]["id"];

export const SHIPPING_CARRIER_IDS = SHIPPING_CARRIERS.map((c) => c.id) as [
  ShippingCarrierId,
  ...ShippingCarrierId[],
];

/** Shipping fee from subtotal only — carrier choice does not change the price. */
export function shippingFor(subtotal: number): number {
  if (subtotal <= 0) return 0;
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return STANDARD_SHIPPING_FEE;
}

/** VAT rate baked into displayed prices (EU-style tax-inclusive pricing). */
export const VAT_RATE = 0.21;

/** The VAT portion already included in a gross (tax-inclusive) amount. */
export function includedVat(grossAmount: number, rate = VAT_RATE): number {
  return grossAmount - grossAmount / (1 + rate);
}
