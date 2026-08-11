"use client";

import { Suspense, useState } from "react";

import ProductDetailView from "@/components/product/ProductDetailView";
import ProductReviewsSection from "@/components/product/ProductReviewsSection";
import type { ProductDetail } from "@/types/product";
import type { ReviewSummary } from "@/types/review";

type ProductPurchaseBlockProps = {
  product: ProductDetail;
  initialSummary: ReviewSummary;
};

function ProductPurchaseBlockInner({
  product,
  initialSummary,
}: ProductPurchaseBlockProps) {
  const [summary, setSummary] = useState(initialSummary);

  return (
    <>
      <ProductDetailView product={product} reviewSummary={summary} />
      <ProductReviewsSection
        productId={product.id}
        productSlug={product.slug}
        initialSummary={initialSummary}
        onSummaryChange={setSummary}
      />
    </>
  );
}

/** Client island: variant query + live review summary stay off the cached RSC tree. */
export default function ProductPurchaseBlock(props: ProductPurchaseBlockProps) {
  return (
    <Suspense fallback={<ProductDetailView product={props.product} reviewSummary={props.initialSummary} />}>
      <ProductPurchaseBlockInner {...props} />
    </Suspense>
  );
}
