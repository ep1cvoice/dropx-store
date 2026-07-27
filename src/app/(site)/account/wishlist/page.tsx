import type { Metadata } from "next";

import AccountPageHeader from "@/components/account/AccountPageHeader";
import WishlistGrid from "@/components/account/WishlistGrid";
import { getWishlistItems } from "@/lib/wishlist";

export const metadata: Metadata = {
  title: "Wishlist — DROPX",
};

export default async function AccountWishlistPage() {
  const items = await getWishlistItems();

  return (
    <>
      <AccountPageHeader title="Wishlist" />
      <WishlistGrid items={items} />
    </>
  );
}
