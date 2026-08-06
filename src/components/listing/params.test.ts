import { describe, expect, it } from "vitest";

import { buildHref, parseCsv, toggleCsv } from "@/components/listing/params";

describe("parseCsv", () => {
  it("returns an empty array for nullish or empty input", () => {
    expect(parseCsv(null)).toEqual([]);
    expect(parseCsv(undefined)).toEqual([]);
    expect(parseCsv("")).toEqual([]);
  });

  it("splits and drops empty segments", () => {
    expect(parseCsv("nike,adidas")).toEqual(["nike", "adidas"]);
    expect(parseCsv("nike,,adidas,")).toEqual(["nike", "adidas"]);
  });
});

describe("toggleCsv", () => {
  it("adds a value to an empty csv", () => {
    expect(toggleCsv(null, "nike")).toBe("nike");
  });

  it("adds a second value", () => {
    expect(toggleCsv("nike", "adidas")).toBe("nike,adidas");
  });

  it("removes an existing value and returns null when empty", () => {
    expect(toggleCsv("nike,adidas", "nike")).toBe("adidas");
    expect(toggleCsv("nike", "nike")).toBeNull();
  });
});

describe("buildHref", () => {
  it("merges updates onto the current query", () => {
    const current = new URLSearchParams("gender=men&sort=newest");
    expect(buildHref("/browse-all", current, { brand: "nike" })).toBe(
      "/browse-all?gender=men&sort=newest&brand=nike",
    );
  });

  it("removes keys set to null or empty string", () => {
    const current = new URLSearchParams("gender=men&q=dunk");
    expect(buildHref("/browse-all", current, { q: null, gender: "" })).toBe(
      "/browse-all",
    );
  });

  it("resets page when callers pass page: null", () => {
    const current = new URLSearchParams("page=3&brand=nike");
    expect(buildHref("/browse-all", current, { page: null, color: "red" })).toBe(
      "/browse-all?brand=nike&color=red",
    );
  });
});
