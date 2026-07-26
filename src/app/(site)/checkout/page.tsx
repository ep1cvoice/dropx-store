import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Info } from "lucide-react";

import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import ShippingMethodSelector from "@/components/checkout/ShippingMethodSelector";
import Button from "@/components/ui/Button";
import { getCart } from "@/lib/cart";
import { inter } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Checkout — DROPX",
};

const labelClass = `${inter.className} mb-1.5 block text-sm text-[#666666]`;
const inputClass = `${inter.className} w-full rounded-md border border-black/15 bg-white px-3.5 py-3 text-sm text-[#121212] placeholder:text-[#aaaaaa] focus:border-[#121212] focus:outline-none`;
const sectionHeadingClass = `${inter.className} text-xs font-bold uppercase tracking-[0.16em] text-[#121212]`;

export default async function CheckoutPage() {
  const cart = await getCart();

  if (cart.items.length === 0) {
    redirect("/cart");
  }

  return (
    <div className="bg-white">
      {/* Step indicator */}
      <div className="border-b border-black/5 bg-[#f4f4f2] px-4 py-5">
        <CheckoutSteps current={1} />
      </div>

      <div className="mx-auto grid w-full max-w-[1120px] gap-10 px-4 py-10 md:px-6 lg:grid-cols-[1fr_360px] lg:gap-12">
        {/* Form column */}
        <div>
          {/* Contact */}
          <section>
            <h2 className={sectionHeadingClass}>Contact information</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className={labelClass} htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="phone">
                  Phone (optional)
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+31 6 1234 5678"
                  className={inputClass}
                />
              </div>
            </div>
            <p
              className={`${inter.className} mt-3 flex items-center gap-1.5 text-xs text-[#888888]`}
            >
              <Info size={13} />
              Checking out as guest — no account needed
            </p>
          </section>

          <hr className="my-8 border-black/10" />

          {/* Shipping address */}
          <section>
            <h2 className={sectionHeadingClass}>Shipping address</h2>
            <div className="mt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="first-name">
                    First Name
                  </label>
                  <input
                    id="first-name"
                    type="text"
                    placeholder="John"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="last-name">
                    Last Name
                  </label>
                  <input
                    id="last-name"
                    type="text"
                    placeholder="Doe"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass} htmlFor="address">
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  placeholder="Keizersgracht 123"
                  className={inputClass}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="city">
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    placeholder="Amsterdam"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="postal-code">
                    Postal Code
                  </label>
                  <input
                    id="postal-code"
                    type="text"
                    placeholder="1015 AB"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass} htmlFor="country">
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  placeholder="Netherlands"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <hr className="my-8 border-black/10" />

          {/* Shipping method */}
          <section>
            <h2 className={`${sectionHeadingClass} mb-4`}>Shipping method</h2>
            <ShippingMethodSelector />
          </section>

          <Button
            variant="accent"
            className="mt-8 h-12 w-full rounded-md text-sm font-semibold uppercase tracking-[0.12em]"
          >
            Continue to payment
          </Button>
        </div>

        {/* Summary column */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <CheckoutSummary
            items={cart.items}
            subtotal={cart.subtotal}
            shipping={cart.shipping}
            total={cart.total}
            currency={cart.currency}
          />
        </aside>
      </div>
    </div>
  );
}
