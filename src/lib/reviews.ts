import { getCurrentUserId } from "@/lib/current-user";
import { advanceDemoOrderStatuses } from "@/lib/orders";
import { prisma } from "@/lib/prisma";
import type {
  ProductReviewItem,
  ReviewEligibility,
  ReviewSummary,
} from "@/types/review";

const EMPTY_SUMMARY: ReviewSummary = { average: 0, count: 0 };

function displayName(name: string | null, lastName: string | null): string {
  const full = [name?.trim(), lastName?.trim()].filter(Boolean).join(" ");
  return full || "DROPX customer";
}

/** Aggregate rating for PDP header. */
export async function getProductReviewSummary(
  productId: string,
): Promise<ReviewSummary> {
  const agg = await prisma.productReview.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: { _all: true },
  });

  const count = agg._count._all;
  if (count === 0) return EMPTY_SUMMARY;

  return {
    average: Math.round((agg._avg.rating ?? 0) * 10) / 10,
    count,
  };
}

/** Newest reviews first for the PDP list. */
export async function getProductReviews(
  productId: string,
): Promise<ProductReviewItem[]> {
  const userId = await getCurrentUserId();

  const rows = await prisma.productReview.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      rating: true,
      body: true,
      verifiedPurchase: true,
      createdAt: true,
      userId: true,
      user: { select: { name: true, lastName: true } },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    rating: row.rating,
    body: row.body,
    verifiedPurchase: row.verifiedPurchase,
    createdAt: row.createdAt.toISOString(),
    authorName: displayName(row.user.name, row.user.lastName),
    isMine: userId != null && row.userId === userId,
  }));
}

/** True when the user has a delivered order line for this product. */
export async function hasDeliveredPurchase(
  userId: string,
  productId: string,
): Promise<boolean> {
  await advanceDemoOrderStatuses(userId);

  const hit = await prisma.orderItem.findFirst({
    where: {
      order: { userId, status: "delivered" },
      sizeRef: { variant: { productId } },
    },
    select: { id: true },
  });

  return hit != null;
}

export async function getReviewEligibility(
  productId: string,
): Promise<ReviewEligibility> {
  const userId = await getCurrentUserId();
  if (!userId) return { status: "guest" };

  const existing = await prisma.productReview.findUnique({
    where: { userId_productId: { userId, productId } },
    select: { id: true },
  });
  if (existing) return { status: "already_reviewed" };

  const purchased = await hasDeliveredPurchase(userId, productId);
  if (!purchased) return { status: "not_purchased" };

  return { status: "eligible" };
}
