"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCurrentUserId } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { hasDeliveredPurchase } from "@/lib/reviews";

const createReviewSchema = z.object({
  productId: z.string().min(1),
  productSlug: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  body: z
    .string()
    .trim()
    .min(10, "Review must be at least 10 characters")
    .max(1000, "Review must be under 1000 characters"),
});

export type CreateReviewResult =
  | { ok: true }
  | { ok: false; error: string };

export async function createReview(input: {
  productId: string;
  productSlug: string;
  rating: number;
  body: string;
}): Promise<CreateReviewResult> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return { ok: false, error: "Sign in to leave a review." };
  }

  const parsed = createReviewSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid review.",
    };
  }

  const { productId, productSlug, rating, body } = parsed.data;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, slug: true },
  });
  if (!product || product.slug !== productSlug) {
    return { ok: false, error: "Product not found." };
  }

  const existing = await prisma.productReview.findUnique({
    where: { userId_productId: { userId, productId } },
    select: { id: true },
  });
  if (existing) {
    return { ok: false, error: "You already reviewed this product." };
  }

  const verified = await hasDeliveredPurchase(userId, productId);
  if (!verified) {
    return {
      ok: false,
      error: "Only customers with a delivered order can leave a review.",
    };
  }

  await prisma.productReview.create({
    data: {
      productId,
      userId,
      rating,
      body,
      verifiedPurchase: true,
    },
  });

  revalidatePath(`/products/${productSlug}`);
  revalidatePath("/account/orders");
  revalidatePath("/account");
  return { ok: true };
}

export type DeleteReviewResult =
  | { ok: true }
  | { ok: false; error: string };

/** Owner-only delete. After remove, the unique slot frees so they can write again. */
export async function deleteReview(input: {
  reviewId: string;
  productSlug: string;
}): Promise<DeleteReviewResult> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return { ok: false, error: "Sign in to delete your review." };
  }

  const reviewId = input.reviewId?.trim();
  const productSlug = input.productSlug?.trim();
  if (!reviewId || !productSlug) {
    return { ok: false, error: "Invalid review." };
  }

  const review = await prisma.productReview.findUnique({
    where: { id: reviewId },
    select: { id: true, userId: true, product: { select: { slug: true } } },
  });

  if (!review || review.product.slug !== productSlug) {
    return { ok: false, error: "Review not found." };
  }
  if (review.userId !== userId) {
    return { ok: false, error: "You can only delete your own review." };
  }

  await prisma.productReview.delete({ where: { id: reviewId } });

  revalidatePath(`/products/${productSlug}`);
  revalidatePath("/account/orders");
  revalidatePath("/account");
  return { ok: true };
}
