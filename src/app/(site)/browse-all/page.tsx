import type { Metadata } from "next";
import { Suspense } from "react";

import ProductListingPage from "@/components/listing/ProductListingPage";
import ProductListingSkeleton from "@/components/listing/ProductListingSkeleton";

export const metadata: Metadata = {
  title: "Browse All Sneakers — DROPX",
  description:
    "Browse the full DROPX sneaker catalogue. Filter by collection, brand, size, price and colour.",
};

type BrowseAllPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function searchKey(
  params: Record<string, string | string[] | undefined>,
): string {
  return Object.entries(params)
    .flatMap(([key, value]) => {
      if (value == null) return [];
      if (Array.isArray(value)) return value.map((v) => `${key}=${v}`);
      return [`${key}=${value}`];
    })
    .sort()
    .join("&");
}

export default async function BrowseAllPage({
  searchParams,
}: BrowseAllPageProps) {
  const resolved = await searchParams;

  return (
    <Suspense
      key={searchKey(resolved) || "browse-all"}
      fallback={<ProductListingSkeleton title="Browse All" />}
    >
      <ProductListingPage title="Browse All" searchParams={resolved} />
    </Suspense>
  );
}
