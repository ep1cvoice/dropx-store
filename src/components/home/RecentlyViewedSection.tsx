"use client";

import { useEffect, useState } from "react";

import SneakerGridSection from "@/components/home/SneakerGridSection";
import {
  RECENTLY_VIEWED_MIN_SHOW,
  readRecentlyViewedIds,
} from "@/lib/recently-viewed";
import type { ProductCardData } from "@/types/product";

export default function RecentlyViewedSection() {
  const [products, setProducts] = useState<ProductCardData[] | null>(null);

  useEffect(() => {
    const ids = readRecentlyViewedIds();
    if (ids.length < RECENTLY_VIEWED_MIN_SHOW) {
      setProducts([]);
      return;
    }

    let cancelled = false;
    const params = new URLSearchParams({ ids: ids.join(",") });

    fetch(`/api/recently-viewed?${params.toString()}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("failed");
        return res.json() as Promise<{ products: ProductCardData[] }>;
      })
      .then((data) => {
        if (cancelled) return;
        setProducts(data.products ?? []);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // null = still resolving; [] / short list = hide rail
  if (products == null) return null;
  if (products.length < RECENTLY_VIEWED_MIN_SHOW) return null;

  return (
    <SneakerGridSection
      title="Recently Viewed"
      products={products}
      desktopCount={Math.min(products.length, 10)}
    />
  );
}
