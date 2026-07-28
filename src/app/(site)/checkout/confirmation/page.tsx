import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import CheckoutShell from "@/components/checkout/CheckoutShell";
import Button from "@/components/ui/Button";
import { anton, inter } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Order confirmed — DROPX",
};

type ConfirmationPageProps = {
  searchParams: Promise<{ order?: string; method?: string }>;
};

const METHOD_LABELS: Record<string, string> = {
  blik: "BLIK",
  card: "Card",
  przelewy24: "Przelewy24",
  "apple-pay": "Apple Pay",
  "google-pay": "Google Pay",
};

export default async function CheckoutConfirmationPage({
  searchParams,
}: ConfirmationPageProps) {
  const { order, method } = await searchParams;
  const orderNumber = order?.trim() || "DX-00000";
  const methodLabel = method ? (METHOD_LABELS[method] ?? method) : null;

  // Empty cart shape — confirmation doesn't show the summary sidebar.
  const emptyCart = {
    items: [],
    itemCount: 0,
    subtotal: 0,
    shipping: 0,
    total: 0,
    currency: "EUR",
  };

  return (
    <CheckoutShell currentStep={3} cart={emptyCart} hideSummary>
      <div className="mx-auto max-w-lg py-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-none bg-[#e8f8ef] text-[#1f9d55]">
          <CheckCircle2 size={36} strokeWidth={1.75} />
        </div>

        <h1
          className={`${anton.className} mt-6 text-4xl uppercase tracking-wide text-[#121212]`}
        >
          Order confirmed
        </h1>

        <p className={`${inter.className} mt-3 text-sm text-[#666666]`}>
          Thanks for your order. This is a mock payment — nothing was charged.
        </p>

        <div
          className={`${inter.className} mt-8 rounded-none border border-black/10 bg-[#f4f4f2] px-6 py-5 text-left`}
        >
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-[#666666]">Order number</span>
            <span className="font-semibold text-[#121212]">#{orderNumber}</span>
          </div>
          {methodLabel && (
            <div className="mt-3 flex items-center justify-between gap-4 border-t border-black/10 pt-3 text-sm">
              <span className="text-[#666666]">Payment method</span>
              <span className="font-semibold text-[#121212]">{methodLabel}</span>
            </div>
          )}
          <div className="mt-3 flex items-center justify-between gap-4 border-t border-black/10 pt-3 text-sm">
            <span className="text-[#666666]">Status</span>
            <span className="font-bold uppercase tracking-wide text-[#1f9d55]">
              Paid
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/browse-all">
            <Button
              variant="accent"
              className="h-12 w-full cursor-pointer rounded-none px-8 text-sm font-semibold uppercase tracking-[0.12em] sm:w-auto"
            >
              Continue shopping
            </Button>
          </Link>
          <Link href="/account/orders">
            <Button
              variant="outline"
              className="h-12 w-full cursor-pointer rounded-none px-8 text-sm font-semibold uppercase tracking-[0.12em] sm:w-auto"
            >
              View orders
            </Button>
          </Link>
        </div>
      </div>
    </CheckoutShell>
  );
}
