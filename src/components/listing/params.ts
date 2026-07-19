import type { ReadonlyURLSearchParams } from "next/navigation";

/**
 * Build a `pathname?query` string from the current params plus a set of
 * updates. A `null`/`""` value removes the key.
 */
export function buildHref(
  pathname: string,
  current: URLSearchParams | ReadonlyURLSearchParams,
  updates: Record<string, string | null>,
): string {
  const params = new URLSearchParams(current.toString());
  for (const [key, value] of Object.entries(updates)) {
    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  }
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

/** Add/remove a value from a comma-separated param; returns null when empty. */
export function toggleCsv(csv: string | null, value: string): string | null {
  const set = new Set(csv ? csv.split(",").filter(Boolean) : []);
  if (set.has(value)) {
    set.delete(value);
  } else {
    set.add(value);
  }
  const next = Array.from(set).join(",");
  return next.length > 0 ? next : null;
}

/** Parse a comma-separated param into a string array. */
export function parseCsv(value: string | null | undefined): string[] {
  return value ? value.split(",").filter(Boolean) : [];
}
