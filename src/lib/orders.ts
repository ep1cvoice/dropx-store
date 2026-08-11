import { getCurrentUserId } from "@/lib/cart";
import { prisma } from "@/lib/prisma";
import {
  DEMO_STATUS_AFTER_MS,
  type OrderStatus,
} from "@/lib/order-status";
import type { OrderStatus as PrismaOrderStatus } from "@/generated/prisma/client";

export type { OrderStatus } from "@/lib/order-status";
export { DEMO_STATUS_AFTER_MS, statusForOrderAge } from "@/lib/order-status";

export type OrderSummary = {
  id: string;
  number: string;
  /** ISO timestamp — plain string so RSC/client boundaries never see a Date. */
  placedAt: string;
  itemCount: number;
  total: number;
  currency: string;
  status: OrderStatus;
  thumbnailUrl: string | null;
  /** First line label for the card subtitle, e.g. "Air Max 90 · EU 42". */
  previewLabel: string | null;
};

function toStatus(status: PrismaOrderStatus): OrderStatus {
  return status;
}

/**
 * Persist demo status advances for this user’s open orders.
 * Cheap updateMany calls — only touches rows that still need to move.
 */
async function advanceDemoOrderStatuses(userId: string): Promise<void> {
  const now = Date.now();
  const shippedBefore = new Date(now - DEMO_STATUS_AFTER_MS.shipped);
  const deliveredBefore = new Date(now - DEMO_STATUS_AFTER_MS.delivered);

  await prisma.$transaction([
    prisma.order.updateMany({
      where: {
        userId,
        status: "processing",
        createdAt: { lte: shippedBefore, gt: deliveredBefore },
      },
      data: { status: "shipped" },
    }),
    prisma.order.updateMany({
      where: {
        userId,
        status: { in: ["processing", "shipped"] },
        createdAt: { lte: deliveredBefore },
      },
      data: { status: "delivered" },
    }),
  ]);
}

/** Real order history for the signed-in user (newest first). */
export async function getOrders(): Promise<OrderSummary[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  await advanceDemoOrderStatuses(userId);

  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      number: true,
      createdAt: true,
      total: true,
      currency: true,
      status: true,
      items: {
        orderBy: { createdAt: "asc" },
        select: {
          quantity: true,
          productName: true,
          size: true,
          imageUrl: true,
        },
      },
    },
  });

  return orders.map((order) => {
    const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);
    const first = order.items[0] ?? null;

    return {
      id: order.id,
      number: order.number,
      placedAt: order.createdAt.toISOString(),
      itemCount,
      total: Number(order.total),
      currency: order.currency,
      status: toStatus(order.status),
      thumbnailUrl: first?.imageUrl ?? null,
      previewLabel: first
        ? `${first.productName} · ${first.size}`
        : null,
    };
  });
}
