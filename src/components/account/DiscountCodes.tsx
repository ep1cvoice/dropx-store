import { TicketPercent } from "lucide-react";

import AccountPlaceholder from "@/components/account/AccountPlaceholder";

export default function DiscountCodes() {
  return (
    <AccountPlaceholder
      icon={TicketPercent}
      title="No discount codes yet"
      description="Available codes will display here when you unlock promotions or receive member offers."
    />
  );
}
