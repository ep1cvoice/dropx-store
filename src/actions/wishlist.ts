"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentUserId } from "@/lib/cart";
import { prisma } from "@/lib/prisma";

export type WishlistActionResult =
  | { ok: true; wishlisted: boolean }
  | { ok: false; error: string };

/** Add the variant to the wishlist if absent, remove it if present. */
export async function toggleWishlist(
  variantId: string,
): Promise<WishlistActionResult> {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  if (!variantId) return { ok: false, error: "No product selected." };

  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_variantId: { userId, variantId } },
    select: { id: true },
  });

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    revalidatePath("/account/wishlist");
    revalidatePath("/", "layout");
    return { ok: true, wishlisted: false };
  }

  await prisma.wishlistItem.create({ data: { userId, variantId } });
  revalidatePath("/account/wishlist");
  revalidatePath("/", "layout");
  return { ok: true, wishlisted: true };
}

/** Remove a variant from the current user's wishlist (idempotent). */
export async function removeFromWishlist(
  variantId: string,
): Promise<WishlistActionResult> {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  await prisma.wishlistItem.deleteMany({ where: { userId, variantId } });
  revalidatePath("/account/wishlist");
  revalidatePath("/", "layout");
  return { ok: true, wishlisted: false };
}
