import type { Metadata } from "next";
import { redirect } from "next/navigation";

import AccountPageHeader from "@/components/account/AccountPageHeader";
import ChangePasswordForm from "@/components/account/ChangePasswordForm";
import ProfileDataForm from "@/components/account/ProfileDataForm";
import { getCurrentUserId } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Profile Data — DROPX",
};

export default async function AccountProfileDataPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      email: true,
      name: true,
      lastName: true,
      phone: true,
      address: true,
      city: true,
      postalCode: true,
      country: true,
    },
  });

  if (!user) redirect("/login");

  return (
    <>
      <AccountPageHeader title="Profile Data" />
      <ProfileDataForm
        defaults={{
          email: user.email,
          firstName: user.name,
          lastName: user.lastName,
          phone: user.phone ?? "",
          address: user.address ?? "",
          city: user.city ?? "",
          postalCode: user.postalCode ?? "",
          country: user.country ?? "Poland",
        }}
      />
      <ChangePasswordForm />
    </>
  );
}
