import { describe, expect, it } from "vitest";

import { SIZE_RUNS, sizesFitGender } from "@/lib/sizes";

describe("SIZE_RUNS", () => {
  it("keeps men/women/unisex runs non-empty and ordered", () => {
    expect(SIZE_RUNS.men.length).toBeGreaterThan(0);
    expect(SIZE_RUNS.women[0]).toBe(36);
    expect(SIZE_RUNS.men.at(-1)).toBe(46);
  });
});

describe("sizesFitGender", () => {
  it("is true when no sizes are selected", () => {
    expect(sizesFitGender("men", [])).toBe(true);
    expect(sizesFitGender("women", [])).toBe(true);
  });

  it("accepts sizes inside the gender run", () => {
    expect(sizesFitGender("men", ["42", "43"])).toBe(true);
    expect(sizesFitGender("women", ["36", "38"])).toBe(true);
  });

  it("rejects sizes outside the gender run", () => {
    expect(sizesFitGender("men", ["38"])).toBe(false);
    expect(sizesFitGender("women", ["45"])).toBe(false);
    expect(sizesFitGender("men", ["42", "38"])).toBe(false);
  });

  it("treats the shared middle (40–42) as valid for both", () => {
    expect(sizesFitGender("men", ["40", "41", "42"])).toBe(true);
    expect(sizesFitGender("women", ["40", "41", "42"])).toBe(true);
  });
});
