import { getCurrentUserId } from "@/lib/cart";
import { prisma } from "@/lib/prisma";

export type WishlistDisplayItem = {
  variantId: string;
  slug: string;
  name: string;
  brand: string;
  color: string;
  imageUrl: string | null;
  price: number;
  currency: string;
};

/** Set of variant ids the current user has wishlisted (empty for guests). */
export async function getWishlistVariantIds(): Promise<Set<string>> {
  const userId = await getCurrentUserId();
  if (!userId) return new Set();

  const items = await prisma.wishlistItem.findMany({
    where: { userId },
    select: { variantId: true },
  });

  return new Set(items.map((i) => i.variantId));
}

/** Full wishlist for the current user, shaped for the wishlist grid. */
export async function getWishlistItems(): Promise<WishlistDisplayItem[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const items = await prisma.wishlistItem.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      variant: {
        select: {
          id: true,
          color: true,
          imageUrl: true,
          price: true,
          product: {
            select: {
              slug: true,
              name: true,
              currency: true,
              brand: { select: { name: true } },
            },
          },
        },
      },
    },
  });

  return items.map(({ variant }) => ({
    variantId: variant.id,
    slug: variant.product.slug,
    name: variant.product.name,
    brand: variant.product.brand.name,
    color: variant.color,
    imageUrl: variant.imageUrl,
    price: variant.price,
    currency: variant.product.currency,
  }));
}
