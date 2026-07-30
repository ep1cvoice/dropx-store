import type { Metadata } from "next";

import Privacy from "./Privacy";

export const metadata: Metadata = {
  title: "Privacy Policy — DROPX",
  description:
    "How DROPX handles account, order, newsletter, and cookie data in this demo store.",
};

export default function PrivacyPage() {
  return <Privacy />;
}
