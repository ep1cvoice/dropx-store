import { redirect } from "next/navigation";

/** Legacy route — settings live under Profile Data now. */
export default function AccountSettingsPage() {
  redirect("/account/profile-data");
}
