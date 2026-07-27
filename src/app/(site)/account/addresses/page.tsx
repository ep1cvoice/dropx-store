import type { Metadata } from "next";
import { MapPin } from "lucide-react";

import AccountPageHeader from "@/components/account/AccountPageHeader";
import AccountPlaceholder from "@/components/account/AccountPlaceholder";

export const metadata: Metadata = {
  title: "Addresses — DROPX",
};

export default function AccountAddressesPage() {
  return (
    <>
      <AccountPageHeader title="Addresses" />
      <AccountPlaceholder
        icon={MapPin}
        title="No saved addresses yet"
        description="Saved shipping and billing addresses will appear here so checkout is one tap away."
      />
    </>
  );
}
