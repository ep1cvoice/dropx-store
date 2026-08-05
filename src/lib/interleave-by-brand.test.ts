import { describe, expect, it } from "vitest";

import { interleaveByBrand } from "@/lib/interleave-by-brand";

describe("interleaveByBrand", () => {
  it("returns the same list when there is one brand or fewer items", () => {
    expect(interleaveByBrand([])).toEqual([]);
    expect(interleaveByBrand([{ brand: "Nike", id: "1" }])).toEqual([
      { brand: "Nike", id: "1" },
    ]);
    expect(
      interleaveByBrand([
        { brand: "Nike", id: "1" },
        { brand: "Nike", id: "2" },
      ]),
    ).toEqual([
      { brand: "Nike", id: "1" },
      { brand: "Nike", id: "2" },
    ]);
  });

  it("round-robins brands alphabetically and keeps within-brand order", () => {
    const input = [
      { brand: "Nike", id: "n1" },
      { brand: "Nike", id: "n2" },
      { brand: "Adidas", id: "a1" },
      { brand: "Adidas", id: "a2" },
      { brand: "Puma", id: "p1" },
    ];

    expect(interleaveByBrand(input).map((p) => p.id)).toEqual([
      "a1",
      "n1",
      "p1",
      "a2",
      "n2",
    ]);
  });
});
