import { describe, expect, it, beforeEach, vi } from "vitest";

import {
  RECENTLY_VIEWED_KEY,
  RECENTLY_VIEWED_MAX,
  pushRecentlyViewedId,
  readRecentlyViewedIds,
} from "@/lib/recently-viewed";

function mockStorage() {
  const store = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
  });
  vi.stubGlobal("window", globalThis);
  return store;
}

describe("recently-viewed storage", () => {
  beforeEach(() => {
    mockStorage();
  });

  it("starts empty", () => {
    expect(readRecentlyViewedIds()).toEqual([]);
  });

  it("pushes newest first and dedupes", () => {
    pushRecentlyViewedId("a");
    pushRecentlyViewedId("b");
    pushRecentlyViewedId("a");
    expect(readRecentlyViewedIds()).toEqual(["a", "b"]);
  });

  it("caps history length", () => {
    for (let i = 0; i < RECENTLY_VIEWED_MAX + 5; i++) {
      pushRecentlyViewedId(`id-${i}`);
    }
    const ids = readRecentlyViewedIds();
    expect(ids).toHaveLength(RECENTLY_VIEWED_MAX);
    expect(ids[0]).toBe(`id-${RECENTLY_VIEWED_MAX + 4}`);
    expect(localStorage.getItem(RECENTLY_VIEWED_KEY)).toBeTruthy();
  });
});
