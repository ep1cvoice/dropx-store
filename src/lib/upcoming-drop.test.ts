import { describe, expect, it } from "vitest";

import { getCountdownParts } from "@/lib/upcoming-drop";

describe("getCountdownParts", () => {
  it("marks expired when now is at or past the target", () => {
    const target = Date.parse("2026-10-15T10:00:00+02:00");
    expect(getCountdownParts(target, target)).toEqual({
      days: "00",
      hours: "00",
      minutes: "00",
      seconds: "00",
      isExpired: true,
    });
    expect(getCountdownParts(target, target + 1000).isExpired).toBe(true);
  });

  it("pads countdown units for a future target", () => {
    const now = Date.parse("2026-10-14T09:58:55+02:00");
    const target = Date.parse("2026-10-15T10:00:00+02:00");
    expect(getCountdownParts(target, now)).toEqual({
      days: "01",
      hours: "00",
      minutes: "01",
      seconds: "05",
      isExpired: false,
    });
  });
});
