import type { Metadata } from "next";
import Link from "next/link";

import { auth } from "@/auth/auth";
import AccountMobileHub from "@/components/account/AccountMobileHub";
import AccountPageHeader from "@/components/account/AccountPageHeader";
import OrdersPanel from "@/components/account/OrdersPanel";
import { inter } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Account — DROPX",
};

export default async function AccountPage() {
  const session = await auth();
  const name = session?.user?.name?.trim() || "Your account";
  const email = session?.user?.email ?? "";

  return (
    <>
      {/* Mobile: profile hub */}
      <div className="lg:hidden">
        <AccountMobileHub name={name} email={email} />
      </div>

      {/* Desktop: orders overview beside the sidebar */}
      <div className="hidden lg:block">
        <AccountPageHeader
          title="My Orders"
          action={
            <Link
              href="/account/orders"
              className={`${inter.className} text-sm font-semibold text-[#e85d2a] transition-opacity hover:opacity-70`}
            >
              View All
            </Link>
          }
        />
        <OrdersPanel />
      </div>
    </>
  );
}
