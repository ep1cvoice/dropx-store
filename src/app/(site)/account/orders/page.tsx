import type { Metadata } from "next";

import AccountPageHeader from "@/components/account/AccountPageHeader";
import OrdersPanel from "@/components/account/OrdersPanel";

export const metadata: Metadata = {
  title: "My Orders — DROPX",
};

export default function AccountOrdersPage() {
  return (
    <>
      <AccountPageHeader title="My Orders" />
      <OrdersPanel />
    </>
  );
}
