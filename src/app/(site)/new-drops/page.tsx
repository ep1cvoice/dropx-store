import type { Metadata } from "next";

import ProductListingPage from "@/components/listing/ProductListingPage";

export const metadata: Metadata = {
  title: "New Drops — DROPX",
  description: "The latest sneaker drops landing at DROPX.",
};

type NewDropsPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function NewDropsPage({
  searchParams,
}: NewDropsPageProps) {
  const resolved = await searchParams;

  return (
    <ProductListingPage
      title="New Drops"
      searchParams={resolved}
      lockedCollection="new-drops"
    />
  );
}
