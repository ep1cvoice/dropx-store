import { NextResponse } from "next/server";

import { getCartItemCount } from "@/lib/cart";
import { getWishlistVariantIds } from "@/lib/wishlist";

/** Lightweight bag snapshot for the shell — keeps the site layout cacheable. */
export async function GET() {
  const [cartCount, wishlistIds] = await Promise.all([
    getCartItemCount(),
    getWishlistVariantIds(),
  ]);

  return NextResponse.json({
    cartCount,
    wishlistIds: [...wishlistIds],
  });
}
