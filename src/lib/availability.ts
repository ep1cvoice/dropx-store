/** True when the product has a future drop date (not yet buyable). */
export function isUpcoming(
  availableAt: Date | string | null | undefined,
  nowMs: number = Date.now(),
): boolean {
  if (availableAt == null) return false;
  const ms =
    typeof availableAt === "string"
      ? new Date(availableAt).getTime()
      : availableAt.getTime();
  return Number.isFinite(ms) && ms > nowMs;
}

export function toIsoOrNull(
  value: Date | string | null | undefined,
): string | null {
  if (value == null) return null;
  if (typeof value === "string") return value;
  return value.toISOString();
}
