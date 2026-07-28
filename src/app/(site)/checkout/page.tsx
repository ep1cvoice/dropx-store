import type { Metadata } from "next";
import { redirect } from "next/navigation";

import CheckoutInformationView from "@/components/checkout/CheckoutInformationView";
import CheckoutShell from "@/components/checkout/CheckoutShell";
import { auth } from "@/auth/auth";
import { getCart } from "@/lib/cart";
import { getCheckoutDraft } from "@/lib/checkout-draft";

export const metadata: Metadata = {
  title: "Checkout — DROPX",
};

export default async function CheckoutPage() {
  const cart = await getCart();

  if (cart.items.length === 0) {
    redirect("/cart");
  }

  const [draft, session] = await Promise.all([getCheckoutDraft(), auth()]);

  const sessionName = session?.user?.name?.trim() ?? "";
  const [sessionFirst = "", ...rest] = sessionName.split(/\s+/);
  const sessionLast = rest.join(" ");

  const defaults = draft ?? {
    email: session?.user?.email ?? "",
    phone: "",
    firstName: sessionFirst,
    lastName: sessionLast,
    address: "",
    city: "",
    postalCode: "",
    country: "Poland",
    shippingMethod: "inpost-paczkomat" as const,
  };

  return (
    <CheckoutShell
      currentStep={1}
      cart={cart}
      hideSummary
      paymentEnabled={Boolean(draft)}
    >
      <CheckoutInformationView
        cart={cart}
        defaults={defaults}
        isEditing={Boolean(draft)}
      />
    </CheckoutShell>
  );
}
