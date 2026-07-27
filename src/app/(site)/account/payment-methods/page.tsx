import type { Metadata } from "next";
import { CreditCard } from "lucide-react";

import AccountPageHeader from "@/components/account/AccountPageHeader";
import AccountPlaceholder from "@/components/account/AccountPlaceholder";

export const metadata: Metadata = {
  title: "Payment Methods — DROPX",
};

export default function AccountPaymentMethodsPage() {
  return (
    <>
      <AccountPageHeader title="Payment Methods" />
      <AccountPlaceholder
        icon={CreditCard}
        title="No payment methods yet"
        description="Securely saved cards will appear here once checkout and payments are live."
      />
    </>
  );
}
