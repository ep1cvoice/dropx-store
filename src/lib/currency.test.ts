import { describe, expect, it } from "vitest";

import {
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
  currencySymbol,
  formatPrice,
  includedVat,
  listPriceFromSale,
  shippingFor,
} from "@/lib/currency";

describe("currencySymbol", () => {
  it("maps known currencies", () => {
    expect(currencySymbol("EUR")).toBe("€");
    expect(currencySymbol("USD")).toBe("$");
    expect(currencySymbol("GBP")).toBe("£");
  });

  it("falls back to the raw code", () => {
    expect(currencySymbol("PLN")).toBe("PLN");
  });
});

describe("formatPrice", () => {
  it("formats with two decimal places", () => {
    expect(formatPrice(129.5, "EUR")).toBe("€129.50");
    expect(formatPrice(0, "USD")).toBe("$0.00");
  });
});

describe("listPriceFromSale", () => {
  it("recovers pre-sale list price from percent off", () => {
    expect(listPriceFromSale(80, 20)).toBeCloseTo(100);
  });

  it("returns sale price when discount is out of range", () => {
    expect(listPriceFromSale(80, 0)).toBe(80);
    expect(listPriceFromSale(80, 100)).toBe(80);
    expect(listPriceFromSale(80, -5)).toBe(80);
  });
});

describe("shippingFor", () => {
  it("is free at or above the threshold", () => {
    expect(shippingFor(FREE_SHIPPING_THRESHOLD)).toBe(0);
    expect(shippingFor(FREE_SHIPPING_THRESHOLD + 1)).toBe(0);
  });

  it("charges the standard fee below the threshold", () => {
    expect(shippingFor(199.99)).toBe(STANDARD_SHIPPING_FEE);
    expect(shippingFor(1)).toBe(STANDARD_SHIPPING_FEE);
  });

  it("is zero for empty carts", () => {
    expect(shippingFor(0)).toBe(0);
    expect(shippingFor(-10)).toBe(0);
  });
});

describe("includedVat", () => {
  it("extracts VAT from a tax-inclusive amount", () => {
    // 121 gross at 21% → 21 VAT
    expect(includedVat(121)).toBeCloseTo(21);
  });
});
