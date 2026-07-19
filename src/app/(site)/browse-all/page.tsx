import type { Metadata } from "next";

import ProductListingPage from "@/components/listing/ProductListingPage";

export const metadata: Metadata = {
  title: "Browse All Sneakers — DROPX",
  description:
    "Browse the full DROPX sneaker catalogue. Filter by collection, brand, size, price and colour.",
};

type BrowseAllPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function BrowseAllPage({
  searchParams,
}: BrowseAllPageProps) {
  const resolved = await searchParams;

  return <ProductListingPage title="Browse All" searchParams={resolved} />;
}
