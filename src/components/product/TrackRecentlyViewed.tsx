"use client";

import { useEffect } from "react";

import { pushRecentlyViewedId } from "@/lib/recently-viewed";

/** Records a PDP visit into localStorage (no UI). */
export default function TrackRecentlyViewed({ productId }: { productId: string }) {
  useEffect(() => {
    pushRecentlyViewedId(productId);
  }, [productId]);

  return null;
}
