"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentUserId } from "@/lib/cart";
import {
  clearCheckoutDraft,
  getCheckoutDraft,
} from "@/lib/checkout-draft";
import { shippingFor } from "@/lib/currency";
import { prisma } from "@/lib/prisma";
import type { PaymentMethod } from "@/generated/prisma/client";

export type MockPaymentMethod =
  | "blik"
  | "card"
  | "przelewy24"
  | "apple-pay"
  | "google-pay";

function toPaymentMethod(method: MockPaymentMethod): PaymentMethod {
  switch (method) {
    case "apple-pay":
      return "apple_pay";
    case "google-pay":
      return "google_pay";
    default:
      return method;
  }
}

function generateOrderNumber(): string {
  return `DX-${Math.floor(10000 + Math.random() * 90000)}`;
}

/**
 * Mock place-order: requires a validated checkout draft, snapshots the cart
 * into an Order (with shipping/contact), decrements stock, clears cart + draft.
 */
export async function placeMockOrder(method: MockPaymentMethod) {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const draft = await getCheckoutDraft();
  if (!draft) redirect("/checkout");

  const cart = await prisma.cart.findUnique({
    where: { userId },
    select: {
      id: true,
      items: {
        select: {
          quantity: true,
          size: {
            select: {
              id: true,
              size: true,
              stock: true,
              variant: {
                select: {
                  color: true,
                  imageUrl: true,
                  price: true,
                  product: {
                    select: {
                      name: true,
                      currency: true,
                      brand: { select: { name: true } },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  for (const item of cart.items) {
    if (item.size.stock < item.quantity) {
      redirect("/cart");
    }
  }

  const currency = cart.items[0]?.size.variant.product.currency ?? "EUR";
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.size.variant.price * item.quantity,
    0,
  );
  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;

  let orderNumber = generateOrderNumber();
  const existing = await prisma.order.findUnique({
    where: { number: orderNumber },
    select: { id: true },
  });
  if (existing) orderNumber = generateOrderNumber();

  await prisma.$transaction(async (tx) => {
    await tx.order.create({
      data: {
        number: orderNumber,
        status: "processing",
        paymentMethod: toPaymentMethod(method),
        currency,
        subtotal,
        shipping,
        total,
        email: draft.email,
        phone: draft.phone || null,
        firstName: draft.firstName,
        lastName: draft.lastName,
        address: draft.address,
        city: draft.city,
        postalCode: draft.postalCode,
        country: draft.country,
        shippingMethod: draft.shippingMethod,
        userId,
        items: {
          create: cart.items.map((item) => ({
            quantity: item.quantity,
            unitPrice: item.size.variant.price,
            productName: item.size.variant.product.name,
            brandName: item.size.variant.product.brand.name,
            color: item.size.variant.color,
            size: item.size.size,
            imageUrl: item.size.variant.imageUrl,
            sizeId: item.size.id,
          })),
        },
      },
    });

    for (const item of cart.items) {
      await tx.variantSize.update({
        where: { id: item.size.id },
        data: { stock: { decrement: item.quantity } },
      });
    }

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
  });

  await clearCheckoutDraft();

  revalidatePath("/", "layout");
  revalidatePath("/cart");
  revalidatePath("/checkout");
  revalidatePath("/account");
  revalidatePath("/account/orders");

  redirect(
    `/checkout/confirmation?order=${orderNumber}&method=${encodeURIComponent(method)}`,
  );
}
