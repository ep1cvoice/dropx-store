import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import { shippingFor } from "@/lib/currency";
import type { CartItem } from "@/types/cart";

export type CartData = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
};

const EMPTY_CART: CartData = {
  items: [],
  itemCount: 0,
  subtotal: 0,
  shipping: 0,
  total: 0,
  currency: "EUR",
};

/**
 * Resolve the current user's id from the session. The credentials session only
 * carries email, so we look up the id by email (email is unique).
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return null;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  return user?.id ?? null;
}

const cartItemSelect = {
  id: true,
  quantity: true,
  size: {
    select: {
      id: true,
      size: true,
      stock: true,
      variant: {
        select: {
          id: true,
          color: true,
          imageUrl: true,
          price: true,
          product: {
            select: {
              id: true,
              slug: true,
              name: true,
              currency: true,
              brand: { select: { name: true } },
            },
          },
        },
      },
    },
  },
} as const;

/** The current user's cart, shaped for the UI with totals derived. */
export async function getCart(): Promise<CartData> {
  const userId = await getCurrentUserId();
  if (!userId) return EMPTY_CART;

  const cart = await prisma.cart.findUnique({
    where: { userId },
    select: {
      items: {
        orderBy: { createdAt: "asc" },
        select: cartItemSelect,
      },
    },
  });

  if (!cart || cart.items.length === 0) return EMPTY_CART;

  const items: CartItem[] = cart.items.map((ci) => {
    const variant = ci.size.variant;
    const product = variant.product;

    return {
      id: ci.id,
      productId: product.id,
      slug: product.slug,
      variantId: variant.id,
      sizeId: ci.size.id,
      name: product.name,
      brand: product.brand.name,
      color: variant.color,
      size: ci.size.size,
      imageUrl: variant.imageUrl,
      price: variant.price,
      currency: product.currency,
      quantity: ci.quantity,
      maxStock: ci.size.stock,
    };
  });

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const shipping = shippingFor(subtotal);
  const currency = items[0]?.currency ?? "EUR";

  return {
    items,
    itemCount,
    subtotal,
    shipping,
    total: subtotal + shipping,
    currency,
  };
}
