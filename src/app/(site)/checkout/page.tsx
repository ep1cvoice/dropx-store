import type { Metadata } from "next";
import { redirect } from "next/navigation";

import CheckoutInformationView from "@/components/checkout/CheckoutInformationView";
import CheckoutShell from "@/components/checkout/CheckoutShell";
import { auth } from "@/auth/auth";
import { getCart, getCurrentUserId } from "@/lib/cart";
import { getCheckoutDraft } from "@/lib/checkout-draft";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Checkout — DROPX",
};

export default async function CheckoutPage() {
  const cart = await getCart();

  if (cart.items.length === 0) {
    redirect("/cart");
  }

  const [draft, session, userId] = await Promise.all([
    getCheckoutDraft(),
    auth(),
    getCurrentUserId(),
  ]);

  const profile = userId
    ? await prisma.user.findUnique({
        where: { id: userId },
        select: {
          email: true,
          name: true,
          lastName: true,
          phone: true,
          address: true,
          city: true,
          postalCode: true,
          country: true,
        },
      })
    : null;

  const sessionName = session?.user?.name?.trim() ?? "";
  const [sessionFirst = "", ...rest] = sessionName.split(/\s+/);
  const sessionLast = rest.join(" ");

  const defaults = draft ?? {
    email: profile?.email ?? session?.user?.email ?? "",
    phone: profile?.phone ?? "",
    firstName: profile?.name?.trim() || sessionFirst,
    lastName: profile?.lastName?.trim() || sessionLast,
    address: profile?.address ?? "",
    city: profile?.city ?? "",
    postalCode: profile?.postalCode ?? "",
    country: profile?.country ?? "Poland",
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
