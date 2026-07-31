import { redirect } from "next/navigation";

/** Legacy route — profile data lives at /account/profile-data. */
export default function AccountAddressesPage() {
  redirect("/account/profile-data");
}
