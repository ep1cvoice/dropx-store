/** localStorage key for PDP browse history (guest + signed-in). */
export const RECENTLY_VIEWED_KEY = "dropx_recently_viewed";

/** Max IDs kept in history (newest first). */
export const RECENTLY_VIEWED_MAX = 10;

/** Home rail stays hidden until at least this many products were viewed. */
export const RECENTLY_VIEWED_MIN_SHOW = 2;

export function readRecentlyViewedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === "string" && id.length > 0);
  } catch {
    return [];
  }
}

/** Push a product id to the front; dedupe; cap length. */
export function pushRecentlyViewedId(productId: string): string[] {
  if (typeof window === "undefined" || !productId) return [];
  const next = [
    productId,
    ...readRecentlyViewedIds().filter((id) => id !== productId),
  ].slice(0, RECENTLY_VIEWED_MAX);

  try {
    window.localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(next));
  } catch {
    // quota / private mode — ignore
  }
  return next;
}
