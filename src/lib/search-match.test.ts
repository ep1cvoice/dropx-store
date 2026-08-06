import { describe, expect, it } from "vitest";

import { matchesSearchQuery } from "@/lib/search-match";

const nikeDunk = {
  name: "Dunk Low 'Panda'",
  slug: "nike-dunk-low-panda",
  brandName: "Nike",
  brandSlug: "nike",
  colors: ["White/Black"],
};

const adidasSamba = {
  name: "Samba OG 'Tokyo Pack'",
  slug: "adidas-tokyo-pack-samba",
  brandName: "Adidas",
  brandSlug: "adidas",
  colors: ["Leopard"],
};

const newBalance550 = {
  name: "550 'Sea Salt'",
  slug: "new-balance-550-sea-salt",
  brandName: "New Balance",
  brandSlug: "new-balance",
  colors: ["Sea Salt"],
};

const infrared = {
  name: "Air Max 90 'Infrared' OG",
  slug: "nike-air-max-90-infrared",
  brandName: "Nike",
  brandSlug: "nike",
  colors: ["Infrared"],
};

describe("matchesSearchQuery", () => {
  it("rejects queries shorter than 2 characters", () => {
    expect(matchesSearchQuery(nikeDunk, "")).toBe(false);
    expect(matchesSearchQuery(nikeDunk, "n")).toBe(false);
    expect(matchesSearchQuery(nikeDunk, "  ")).toBe(false);
  });

  it("matches a single brand name", () => {
    expect(matchesSearchQuery(nikeDunk, "nike")).toBe(true);
    expect(matchesSearchQuery(nikeDunk, "NIKE")).toBe(true);
    expect(matchesSearchQuery(adidasSamba, "adidas")).toBe(true);
  });

  it("matches brand + model across separate fields", () => {
    expect(matchesSearchQuery(nikeDunk, "Nike Dunk")).toBe(true);
    expect(matchesSearchQuery(adidasSamba, "Adidas Samba")).toBe(true);
    expect(matchesSearchQuery(newBalance550, "New Balance 550")).toBe(true);
  });

  it("matches hyphenated slug forms of multi-word brands", () => {
    expect(matchesSearchQuery(newBalance550, "new-balance")).toBe(true);
    expect(matchesSearchQuery(newBalance550, "New Balance")).toBe(true);
  });

  it("matches colourway phrases", () => {
    expect(matchesSearchQuery(infrared, "Infrared")).toBe(true);
    expect(matchesSearchQuery(infrared, "infrared")).toBe(true);
  });

  it("does not match unrelated brands or models", () => {
    expect(matchesSearchQuery(nikeDunk, "adidas")).toBe(false);
    expect(matchesSearchQuery(nikeDunk, "Samba")).toBe(false);
    expect(matchesSearchQuery(adidasSamba, "Nike Dunk")).toBe(false);
  });

  it("requires every token to hit for multi-word queries", () => {
    expect(matchesSearchQuery(nikeDunk, "Nike Jordan")).toBe(false);
    expect(matchesSearchQuery(converseLike(), "converse chuck")).toBe(true);
  });
});

function converseLike() {
  return {
    name: "Chuck 70 Hi",
    slug: "converse-chuck-70-hi",
    brandName: "Converse",
    brandSlug: "converse",
  };
}
