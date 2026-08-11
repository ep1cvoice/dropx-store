import { getCurrentUserId } from "@/lib/cart";
import { prisma } from "@/lib/prisma";
import {
  DEMO_STATUS_AFTER_MS,
  type OrderStatus,
} from "@/lib/order-status";
import type { OrderStatus as PrismaOrderStatus } from "@/generated/prisma/client";

export type { OrderStatus } from "@/lib/order-status";
export { DEMO_STATUS_AFTER_MS, statusForOrderAge } from "@/lib/order-status";

export type OrderLineSummary = {
  id: string;
  productName: string;
  brandName: string;
  size: string;
  imageUrl: string | null;
  quantity: number;
  /** Null if the size/product was removed from the catalog. */
  productId: string | null;
  productSlug: string | null;
  /** Delivered + product still exists + user has not reviewed this pair yet. */
  canReview: boolean;
  /** Show “Your review” once per product (already reviewed). */
  showReviewedLink: boolean;
};

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
  items: OrderLineSummary[];
};

function toStatus(status: PrismaOrderStatus): OrderStatus {
  return status;
}

/**
 * Persist demo status advances for this user’s open orders.
 * Cheap updateMany calls — only touches rows that still need to move.
 * Also used before review eligibility so “delivered” unlocks without visiting Orders.
 */
export async function advanceDemoOrderStatuses(userId: string): Promise<void> {
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

  const [orders, reviewedRows] = await Promise.all([
    prisma.order.findMany({
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
            id: true,
            quantity: true,
            productName: true,
            brandName: true,
            size: true,
            imageUrl: true,
            sizeRef: {
              select: {
                variant: {
                  select: {
                    product: { select: { id: true, slug: true } },
                  },
                },
              },
            },
          },
        },
      },
    }),
    prisma.productReview.findMany({
      where: { userId },
      select: { productId: true },
    }),
  ]);

  const reviewedProductIds = new Set(reviewedRows.map((r) => r.productId));

  return orders.map((order) => {
    const status = toStatus(order.status);
    const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);
    const first = order.items[0] ?? null;

    // One review/view-review CTA per product per order (not per size line).
    const reviewCtaShown = new Set<string>();
    const reviewedLinkShown = new Set<string>();

    const items: OrderLineSummary[] = order.items.map((item) => {
      const productId = item.sizeRef?.variant.product.id ?? null;
      const productSlug = item.sizeRef?.variant.product.slug ?? null;
      const hasReviewed =
        productId != null && reviewedProductIds.has(productId);
      const showReviewCta =
        status === "delivered" &&
        productId != null &&
        productSlug != null &&
        !hasReviewed &&
        !reviewCtaShown.has(productId);
      const showReviewedLink =
        hasReviewed &&
        productId != null &&
        productSlug != null &&
        !reviewedLinkShown.has(productId);

      if (showReviewCta && productId) reviewCtaShown.add(productId);
      if (showReviewedLink && productId) reviewedLinkShown.add(productId);

      return {
        id: item.id,
        productName: item.productName,
        brandName: item.brandName,
        size: item.size,
        imageUrl: item.imageUrl,
        quantity: item.quantity,
        productId,
        productSlug,
        canReview: showReviewCta,
        showReviewedLink: showReviewedLink,
      };
    });

    return {
      id: order.id,
      number: order.number,
      placedAt: order.createdAt.toISOString(),
      itemCount,
      total: Number(order.total),
      currency: order.currency,
      status,
      thumbnailUrl: first?.imageUrl ?? null,
      previewLabel: first
        ? `${first.productName} · ${first.size}`
        : null,
      items,
    };
  });
}
