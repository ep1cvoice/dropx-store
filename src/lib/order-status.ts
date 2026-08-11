export type OrderStatus = "processing" | "shipped" | "delivered";

/**
 * Demo fulfillment timeline (no real warehouse).
 * Real shops update status from ERP/WMS or an admin panel — here we advance
 * automatically so “delivered” unlocks later features like reviews.
 */
export const DEMO_STATUS_AFTER_MS = {
  shipped: 15_000,
  delivered: 45_000,
} as const;

/** Pure helper: which status an order should have given its age. */
export function statusForOrderAge(
  ageMs: number,
  current: OrderStatus = "processing",
): OrderStatus {
  let next: OrderStatus = "processing";
  if (ageMs >= DEMO_STATUS_AFTER_MS.delivered) next = "delivered";
  else if (ageMs >= DEMO_STATUS_AFTER_MS.shipped) next = "shipped";

  // Never move backwards if an admin (later) set a further status.
  const rank: Record<OrderStatus, number> = {
    processing: 0,
    shipped: 1,
    delivered: 2,
  };
  return rank[next] >= rank[current] ? next : current;
}
