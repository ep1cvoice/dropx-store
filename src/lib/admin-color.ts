const COLOR_WORDS = [
  "white",
  "black",
  "red",
  "blue",
  "green",
  "yellow",
  "orange",
  "purple",
  "pink",
  "brown",
  "grey",
  "gray",
  "beige",
  "navy",
  "cream",
  "gold",
  "silver",
  "multi",
] as const;

/** Derive a normalized color-family bucket when none is provided. */
export function deriveColorFamily(
  color: string,
  provided?: string | null,
): string {
  if (provided?.trim()) return provided.trim().toLowerCase();

  const lower = color.toLowerCase();
  for (const word of COLOR_WORDS) {
    if (lower.includes(word)) {
      return word === "gray" ? "grey" : word;
    }
  }

  const first = lower.split(/\s+/)[0]?.replace(/[^a-z]/g, "") ?? "";
  return first || "multi";
}
