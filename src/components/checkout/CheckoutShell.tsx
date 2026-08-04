import type { ReactNode } from "react";

import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import type { CartData } from "@/lib/cart";

type CheckoutShellProps = {
  currentStep: 1 | 2 | 3;
  cart: CartData;
  children: ReactNode;
  /** Hide the order summary sidebar (used on confirmation / custom layouts). */
  hideSummary?: boolean;
  /** Allow jumping to Payment from the stepper (after information is saved). */
  paymentEnabled?: boolean;
};

export default function CheckoutShell({
  currentStep,
  cart,
  children,
  hideSummary = false,
  paymentEnabled = false,
}: CheckoutShellProps) {
  return (
    <div className="bg-white">
      <div className="border-b border-black/5 bg-[#f4f4f2] px-4 py-5">
        <CheckoutSteps
          current={currentStep}
          paymentEnabled={paymentEnabled}
        />
      </div>

      <div
        className={`mx-auto w-full max-w-[1120px] px-4 py-10 md:px-6 ${
          hideSummary
            ? ""
            : "grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-12"
        }`}
      >
        {/* Summary first on mobile; form first (left) on desktop */}
        {!hideSummary && (
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
        )}

        <div className={hideSummary ? undefined : "order-2 lg:order-1"}>
          {children}
        </div>
      </div>
    </div>
  );
}
