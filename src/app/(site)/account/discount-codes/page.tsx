import type { Metadata } from "next";

import AccountPageHeader from "@/components/account/AccountPageHeader";
import DiscountCodes from "@/components/account/DiscountCodes";

export const metadata: Metadata = {
  title: "Discount Codes — DROPX",
};

export default function AccountDiscountCodesPage() {
  return (
    <>
      <AccountPageHeader title="Discount Codes" />
      <DiscountCodes />
    </>
  );
}
