import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import CheckoutShell from "@/components/checkout/CheckoutShell";
import PaymentForm from "@/components/checkout/PaymentForm";
import { getCart } from "@/lib/cart";
import { getCheckoutDraft } from "@/lib/checkout-draft";
import { inter } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Payment — DROPX",
};

export default async function CheckoutPaymentPage() {
  const cart = await getCart();

  if (cart.items.length === 0) {
    redirect("/cart");
  }

  const draft = await getCheckoutDraft();
  if (!draft) {
    redirect("/checkout");
  }

  return (
    <CheckoutShell currentStep={2} cart={cart} paymentEnabled>
      <Link
        href="/checkout"
        className={`${inter.className} mb-6 inline-flex items-center gap-1.5 text-sm text-[#666666] transition-colors hover:text-[#e85d2a]`}
      >
        <ArrowLeft size={16} />
        Edit information
      </Link>

      <PaymentForm total={cart.total} currency={cart.currency} />
    </CheckoutShell>
  );
}
