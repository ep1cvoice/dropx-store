import type { Metadata } from "next";

import ProductListingPage from "@/components/listing/ProductListingPage";

export const metadata: Metadata = {
  title: "Sale — DROPX",
  description: "Discounted sneakers and limited-time deals at DROPX.",
};

type SalePageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SalePage({ searchParams }: SalePageProps) {
  const resolved = await searchParams;

  return (
    <ProductListingPage
      title="Sale"
      searchParams={resolved}
      lockedCollection="sale"
    />
  );
}
