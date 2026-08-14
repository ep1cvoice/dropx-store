import type { Metadata } from "next";
import Link from "next/link";

import AccountMobileHub from "@/components/account/AccountMobileHub";
import AccountPageHeader from "@/components/account/AccountPageHeader";
import OrdersPanel from "@/components/account/OrdersPanel";
import { getCurrentUserId } from "@/lib/current-user";
import { inter } from "@/lib/fonts";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Account — DROPX",
};

export default async function AccountPage() {
  const userId = await getCurrentUserId();
  const user = userId
    ? await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, name: true, lastName: true, role: true },
      })
    : null;

  const name = user
    ? `${user.name} ${user.lastName}`.trim()
    : "Your account";
  const email = user?.email ?? "";

  return (
    <>
      {/* Mobile: profile hub */}
      <div className="lg:hidden">
        <AccountMobileHub
          name={name}
          email={email}
          isAdmin={user?.role === "ADMIN"}
        />
      </div>

      {/* Desktop: orders overview beside the sidebar */}
      <div className="hidden lg:block">
        <AccountPageHeader
          title="My Orders"
          
        />
        <OrdersPanel />
      </div>
    </>
  );
}
