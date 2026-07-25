"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentUserId } from "@/lib/cart";
import { prisma } from "@/lib/prisma";

export type CartActionResult = { ok: true } | { ok: false; error: string };

/**
 * Add `quantity` of a specific size to the current user's cart. Guests are sent
 * to the login page. Quantity is clamped to available stock.
 */
export async function addToCart(
  sizeId: string,
  quantity = 1,
): Promise<CartActionResult> {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  if (!sizeId) return { ok: false, error: "No size selected." };

  const size = await prisma.variantSize.findUnique({
    where: { id: sizeId },
    select: { stock: true },
  });

  if (!size) return { ok: false, error: "This size is no longer available." };
  if (size.stock <= 0) return { ok: false, error: "This size is out of stock." };

  const cart = await prisma.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
    select: { id: true },
  });

  const existing = await prisma.cartItem.findUnique({
    where: { cartId_sizeId: { cartId: cart.id, sizeId } },
    select: { quantity: true },
  });

  const nextQuantity = Math.min(
    (existing?.quantity ?? 0) + quantity,
    size.stock,
  );

  await prisma.cartItem.upsert({
    where: { cartId_sizeId: { cartId: cart.id, sizeId } },
    create: { cartId: cart.id, sizeId, quantity: Math.min(quantity, size.stock) },
    update: { quantity: nextQuantity },
  });

  revalidatePath("/cart");
  return { ok: true };
}

/** Set the quantity of a line item (clamped between 1 and available stock). */
export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number,
): Promise<CartActionResult> {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const item = await prisma.cartItem.findFirst({
    where: { id: cartItemId, cart: { userId } },
    select: { id: true, size: { select: { stock: true } } },
  });

  if (!item) return { ok: false, error: "Item not found in your cart." };

  const clamped = Math.max(1, Math.min(quantity, item.size.stock));

  await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity: clamped },
  });

  revalidatePath("/cart");
  return { ok: true };
}

/** Remove a line item from the current user's cart. */
export async function removeCartItem(
  cartItemId: string,
): Promise<CartActionResult> {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  await prisma.cartItem.deleteMany({
    where: { id: cartItemId, cart: { userId } },
  });

  revalidatePath("/cart");
  return { ok: true };
}
