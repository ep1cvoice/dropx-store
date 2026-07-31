import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import AccountSidebar from "@/components/account/AccountSidebar";
import { getCurrentUserId } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export default async function AccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true, lastName: true },
  });

  if (!user) redirect("/login");

  const name = `${user.name} ${user.lastName}`.trim() || "Your account";
  const email = user.email;

  return (
    <div className="min-h-[70vh] bg-white">
      <div className="mx-auto w-full max-w-[1120px] px-4 py-8 lg:px-6 lg:py-10">
        <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-10">
          <aside className="hidden lg:block lg:self-start">
            <AccountSidebar name={name} email={email} />
          </aside>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
