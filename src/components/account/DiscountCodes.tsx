import Link from "next/link";
import { TicketPercent } from "lucide-react";

import AccountPlaceholder from "@/components/account/AccountPlaceholder";
import { isCurrentUserPromoEligible } from "@/lib/newsletter";
import { MEMBER_PROMO_CODE, MEMBER_PROMO_MIN_SUBTOTAL } from "@/lib/promo";
import { inter } from "@/lib/fonts";

export default async function DiscountCodes() {
  const eligible = await isCurrentUserPromoEligible();

  if (!eligible) {
    return (
      <AccountPlaceholder
        icon={TicketPercent}
        title="No discount codes yet"
        description="Subscribe to the newsletter with your account email to unlock MEMBER10 — 10% off orders of €400 or more."
      />
    );
  }

  return (
    <div className="rounded-none border border-black/10 p-5 md:p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-none bg-[#f4f4f2] text-[#121212]">
          <TicketPercent size={22} strokeWidth={1.75} />
        </div>
        <div className={`${inter.className} min-w-0 flex-1`}>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#888888]">
            Newsletter reward
          </p>
          <p className="mt-1 text-2xl font-bold tracking-wide text-[#121212]">
            {MEMBER_PROMO_CODE}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[#666666]">
            10% off when your cart is €{MEMBER_PROMO_MIN_SUBTOTAL} or more. Apply
            it at checkout from your cart.
          </p>
          <Link
            href="/cart"
            className="mt-4 inline-block text-sm font-semibold text-[#e85d2a] transition-opacity hover:opacity-70"
          >
            Go to cart
          </Link>
        </div>
      </div>
    </div>
  );
}
