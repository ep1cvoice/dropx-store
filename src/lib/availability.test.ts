import { describe, expect, it } from "vitest";

import { isUpcoming, toIsoOrNull } from "@/lib/availability";

describe("isUpcoming", () => {
  const now = Date.parse("2026-08-06T12:00:00.000Z");

  it("is false when availableAt is missing", () => {
    expect(isUpcoming(null, now)).toBe(false);
    expect(isUpcoming(undefined, now)).toBe(false);
  });

  it("is true for a future Date or ISO string", () => {
    expect(isUpcoming(new Date("2026-10-15T08:00:00.000Z"), now)).toBe(true);
    expect(isUpcoming("2026-10-15T08:00:00.000Z", now)).toBe(true);
  });

  it("is false when the drop date is now or in the past", () => {
    expect(isUpcoming(new Date(now), now)).toBe(false);
    expect(isUpcoming(new Date(now - 1000), now)).toBe(false);
    expect(isUpcoming("2026-01-01T00:00:00.000Z", now)).toBe(false);
  });

  it("is false for invalid date strings", () => {
    expect(isUpcoming("not-a-date", now)).toBe(false);
  });
});

describe("toIsoOrNull", () => {
  it("returns null for missing values", () => {
    expect(toIsoOrNull(null)).toBeNull();
    expect(toIsoOrNull(undefined)).toBeNull();
  });

  it("passes ISO strings through and serializes Dates", () => {
    expect(toIsoOrNull("2026-10-15T08:00:00.000Z")).toBe(
      "2026-10-15T08:00:00.000Z",
    );
    expect(toIsoOrNull(new Date("2026-10-15T08:00:00.000Z"))).toBe(
      "2026-10-15T08:00:00.000Z",
    );
  });
});
