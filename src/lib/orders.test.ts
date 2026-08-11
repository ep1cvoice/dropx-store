import { describe, expect, it } from "vitest";

import {
  DEMO_STATUS_AFTER_MS,
  statusForOrderAge,
} from "@/lib/order-status";

describe("statusForOrderAge", () => {
  it("stays processing while young", () => {
    expect(statusForOrderAge(0)).toBe("processing");
    expect(statusForOrderAge(DEMO_STATUS_AFTER_MS.shipped - 1)).toBe(
      "processing",
    );
  });

  it("becomes shipped after the shipped threshold", () => {
    expect(statusForOrderAge(DEMO_STATUS_AFTER_MS.shipped)).toBe("shipped");
    expect(statusForOrderAge(DEMO_STATUS_AFTER_MS.delivered - 1)).toBe(
      "shipped",
    );
  });

  it("becomes delivered after the delivered threshold", () => {
    expect(statusForOrderAge(DEMO_STATUS_AFTER_MS.delivered)).toBe("delivered");
    expect(statusForOrderAge(DEMO_STATUS_AFTER_MS.delivered + 60_000)).toBe(
      "delivered",
    );
  });

  it("does not move an order backwards", () => {
    expect(statusForOrderAge(0, "delivered")).toBe("delivered");
    expect(statusForOrderAge(DEMO_STATUS_AFTER_MS.shipped, "delivered")).toBe(
      "delivered",
    );
  });
});
