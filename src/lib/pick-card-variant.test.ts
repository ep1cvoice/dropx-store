import { describe, expect, it } from "vitest";

import { pickCardVariant } from "@/lib/pick-card-variant";

const variants = [
  { id: "1", colorFamily: "black" },
  { id: "2", colorFamily: "red" },
  { id: "3", colorFamily: "white" },
];

describe("pickCardVariant", () => {
  it("returns null for an empty list", () => {
    expect(pickCardVariant([])).toBeNull();
  });

  it("returns the first variant when no preference is given", () => {
    expect(pickCardVariant(variants)?.id).toBe("1");
    expect(pickCardVariant(variants, [])?.id).toBe("1");
  });

  it("prefers the first matching color family in filter order", () => {
    expect(pickCardVariant(variants, ["red", "white"])?.id).toBe("2");
    expect(pickCardVariant(variants, ["white", "red"])?.id).toBe("3");
  });

  it("falls back to the first variant when no preferred color matches", () => {
    expect(pickCardVariant(variants, ["green", "navy"])?.id).toBe("1");
  });
});
