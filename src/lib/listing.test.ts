import { describe, expect, it } from "vitest";

import {
  isCollectionSlug,
  isGenderFilter,
  isProductCategory,
  isSortOption,
  normalizeSearchQuery,
  searchQueryAsSlug,
  searchQueryTokens,
} from "@/lib/listing";

describe("normalizeSearchQuery", () => {
  it("returns empty string for nullish input", () => {
    expect(normalizeSearchQuery(null)).toBe("");
    expect(normalizeSearchQuery(undefined)).toBe("");
  });

  it("trims and collapses whitespace", () => {
    expect(normalizeSearchQuery("  air   max  90  ")).toBe("air max 90");
  });

  it("preserves a single trimmed token", () => {
    expect(normalizeSearchQuery("infrared")).toBe("infrared");
  });
});

describe("searchQueryAsSlug", () => {
  it("turns spaces into hyphens", () => {
    expect(searchQueryAsSlug("New Balance")).toBe("new-balance");
  });
});

describe("searchQueryTokens", () => {
  it("splits on spaces", () => {
    expect(searchQueryTokens("Nike Dunk")).toEqual(["Nike", "Dunk"]);
  });
});

describe("listing type guards", () => {
  it("accepts known collection slugs", () => {
    expect(isCollectionSlug("browse-all")).toBe(true);
    expect(isCollectionSlug("sale")).toBe(true);
    expect(isCollectionSlug("not-a-collection")).toBe(false);
    expect(isCollectionSlug(undefined)).toBe(false);
  });

  it("accepts known sort options", () => {
    expect(isSortOption("newest")).toBe(true);
    expect(isSortOption("price-asc")).toBe(true);
    expect(isSortOption("popular")).toBe(false);
  });

  it("accepts known gender filters", () => {
    expect(isGenderFilter("men")).toBe(true);
    expect(isGenderFilter("kids")).toBe(false);
  });

  it("accepts known product categories", () => {
    expect(isProductCategory("running")).toBe(true);
    expect(isProductCategory("hiking")).toBe(false);
  });
});
