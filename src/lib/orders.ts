import { getCurrentUserId } from "@/lib/cart";
import { prisma } from "@/lib/prisma";
import type { OrderStatus as PrismaOrderStatus } from "@/generated/prisma/client";

export type OrderStatus = "processing" | "shipped" | "delivered";

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

/** Real order history for the signed-in user (newest first). */
export async function getOrders(): Promise<OrderSummary[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];

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
