import { NextResponse } from "next/server";

import { getProductBySlug } from "@/lib/catalog";
import {
  getProductReviews,
  getProductReviewSummary,
  getReviewEligibility,
} from "@/lib/reviews";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

/** User-aware reviews payload — kept off the cached PDP RSC tree. */
export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const [summary, reviews, eligibility] = await Promise.all([
    getProductReviewSummary(product.id),
    getProductReviews(product.id),
    getReviewEligibility(product.id),
  ]);

  return NextResponse.json({ summary, reviews, eligibility });
}
