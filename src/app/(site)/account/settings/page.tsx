import type { Metadata } from "next";
import { Settings } from "lucide-react";

import AccountPageHeader from "@/components/account/AccountPageHeader";
import AccountPlaceholder from "@/components/account/AccountPlaceholder";

export const metadata: Metadata = {
  title: "Settings — DROPX",
};

export default function AccountSettingsPage() {
  return (
    <>
      <AccountPageHeader title="Settings" />
      <AccountPlaceholder
        icon={Settings}
        title="Settings coming soon"
        description="Notification preferences and other account options will appear here."
      />
    </>
  );
}
