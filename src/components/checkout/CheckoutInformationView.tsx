"use client";

import CheckoutInformationForm from "@/components/checkout/CheckoutInformationForm";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import type { CartData } from "@/lib/cart";
import type { CheckoutInformationValues } from "@/lib/validation";

type CheckoutInformationViewProps = {
  cart: CartData;
  defaults?: CheckoutInformationValues | null;
  isEditing?: boolean;
};

export default function CheckoutInformationView({
  cart,
  defaults,
  isEditing = false,
}: CheckoutInformationViewProps) {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-12">
      {/* Summary first on mobile; form first (left) on desktop */}
      <aside className="order-1 lg:order-2 lg:sticky lg:top-6 lg:self-start">
        <CheckoutSummary
          items={cart.items}
          subtotal={cart.subtotal}
          shipping={cart.shipping}
          discount={cart.discount}
          promoCode={cart.promoCode}
          total={cart.total}
          currency={cart.currency}
        />
      </aside>
      <div className="order-2 lg:order-1">
        <CheckoutInformationForm defaults={defaults} isEditing={isEditing} />
      </div>
    </div>
  );
}
