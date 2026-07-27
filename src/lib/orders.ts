import { prisma } from "@/lib/prisma";

export type OrderStatus = "processing" | "shipped" | "delivered";

export type OrderSummary = {
  id: string;
  number: string;
  placedAt: Date;
  itemCount: number;
  total: number;
  currency: string;
  status: OrderStatus;
  thumbnailUrl: string | null;
};

// NOTE: There is no Order model yet — real orders arrive once checkout is wired
// up. Until then we surface representative sample orders so the account UI is
// reviewable. Thumbnails are pulled from real catalog images.
const SAMPLE_ORDERS: Omit<OrderSummary, "thumbnailUrl">[] = [
  {
    id: "dx-78234",
    number: "DX-78234",
    placedAt: new Date("2026-03-28"),
    itemCount: 2,
    total: 359.9,
    currency: "EUR",
    status: "delivered",
  },
  {
    id: "dx-77891",
    number: "DX-77891",
    placedAt: new Date("2026-04-05"),
    itemCount: 1,
    total: 219.95,
    currency: "EUR",
    status: "shipped",
  },
  {
    id: "dx-76450",
    number: "DX-76450",
    placedAt: new Date("2026-04-12"),
    itemCount: 3,
    total: 547.85,
    currency: "EUR",
    status: "processing",
  },
];

/** Sample order history for the account area (placeholder until checkout lands). */
export async function getOrders(): Promise<OrderSummary[]> {
  const variants = await prisma.productVariant.findMany({
    where: { imageUrl: { not: null } },
    take: SAMPLE_ORDERS.length,
    orderBy: { createdAt: "asc" },
    select: { imageUrl: true },
  });

  return SAMPLE_ORDERS.map((order, index) => ({
    ...order,
    thumbnailUrl: variants[index]?.imageUrl ?? null,
  }));
}
