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
    <div className="min-w-0 bg-white">
      <div className="border-b border-black/5 bg-[#f4f4f2] px-3 py-4 sm:px-4 sm:py-5">
        <CheckoutSteps
          current={currentStep}
          paymentEnabled={paymentEnabled}
        />
      </div>

      <div
        className={`mx-auto w-full min-w-0 max-w-[1120px] px-4 py-8 md:px-6 md:py-10 ${
          hideSummary
            ? ""
            : "grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12"
        }`}
      >
        {/* Summary first on mobile; form first (left) on desktop */}
        {!hideSummary && (
          <aside className="order-1 min-w-0 lg:order-2 lg:sticky lg:top-6 lg:self-start">
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

        <div className={hideSummary ? "min-w-0" : "order-2 min-w-0 lg:order-1"}>
          {children}
        </div>
      </div>
    </div>
  );
}
