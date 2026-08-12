import type { Metadata } from "next";

import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Admin — DROPX",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return <AdminShell adminName={admin.name}>{children}</AdminShell>;
}
