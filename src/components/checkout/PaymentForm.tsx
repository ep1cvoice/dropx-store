"use client";

import { useState, useTransition } from "react";
import {
  CreditCard,
  Info,
  Landmark,
  Lock,
  Smartphone,
  Wallet,
} from "lucide-react";

import { placeMockOrder } from "@/actions/checkout";
import Button from "@/components/ui/Button";
import { formatPrice } from "@/lib/currency";
import { inter } from "@/lib/fonts";

type PaymentMethodId =
  | "blik"
  | "card"
  | "przelewy24"
  | "apple-pay"
  | "google-pay";

type PaymentMethod = {
  id: PaymentMethodId;
  label: string;
  description: string;
  mockNote: string;
  icon: typeof CreditCard;
};

const METHODS: PaymentMethod[] = [
  {
    id: "blik",
    label: "BLIK",
    description: "Pay with a code from your banking app",
    mockNote:
      "Mock only — no BLIK code needed. A real checkout would ask for a 6-digit code from your bank app.",
    icon: Smartphone,
  },
  {
    id: "card",
    label: "Card",
    description: "Visa, Mastercard, Maestro",
    mockNote:
      "Mock only — don’t enter real card details. No card number, expiry, or CVC is collected here.",
    icon: CreditCard,
  },
  {
    id: "przelewy24",
    label: "Przelewy24",
    description: "Polish online bank transfer",
    mockNote:
      "Mock only — no bank redirect. A real checkout would send you to Przelewy24 to finish the transfer.",
    icon: Landmark,
  },
  {
    id: "apple-pay",
    label: "Apple Pay",
    description: "Pay quickly with Apple Pay",
    mockNote:
      "Mock only — Apple Pay won’t open. We just simulate a successful payment.",
    icon: Wallet,
  },
  {
    id: "google-pay",
    label: "Google Pay",
    description: "Pay quickly with Google Pay",
    mockNote:
      "Mock only — Google Pay won’t open. We just simulate a successful payment.",
    icon: Wallet,
  },
];

type PaymentFormProps = {
  total: number;
  currency: string;
};

export default function PaymentForm({ total, currency }: PaymentFormProps) {
  const [method, setMethod] = useState<PaymentMethodId>("blik");
  const [isPending, startTransition] = useTransition();

  const selected = METHODS.find((m) => m.id === method) ?? METHODS[0];

  function handlePay() {
    startTransition(async () => {
      await placeMockOrder(method);
    });
  }

  return (
    <div className={inter.className}>
      <section>
        <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[#121212]">
          Payment method
        </h2>
        <p className="mt-2 text-sm text-[#666666]">
          Mock checkout — nothing is charged and no payment data is stored.
          Pick a method to continue.
        </p>

        <div className="mt-4 space-y-3">
          {METHODS.map((item) => {
            const active = method === item.id;
            const Icon = item.icon;
            return (
              <label
                key={item.id}
                className={`flex cursor-pointer items-center gap-3 rounded-none border px-4 py-4 transition-colors ${
                  active
                    ? "border-[#121212]"
                    : "border-black/15 hover:border-black/30"
                }`}
              >
                <input
                  type="radio"
                  name="payment-method"
                  value={item.id}
                  checked={active}
                  onChange={() => setMethod(item.id)}
                  className="sr-only"
                />
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-none border ${
                    active ? "border-[#121212]" : "border-black/30"
                  }`}
                >
                  {active && (
                    <span className="h-2 w-2 rounded-none bg-[#121212]" />
                  )}
                </span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-none bg-[#f4f4f2] text-[#121212]">
                  <Icon size={18} strokeWidth={1.75} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-[#121212]">
                    {item.label}
                  </span>
                  <span className="block text-xs text-[#888888]">
                    {item.description}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </section>

      <div className="mt-8 flex gap-3 rounded-none border border-black/10 bg-[#f4f4f2] px-4 py-4 text-sm text-[#555555]">
        <Info size={18} className="mt-0.5 shrink-0 text-[#888888]" />
        <p>{selected.mockNote}</p>
      </div>

      <Button
        variant="accent"
        onClick={handlePay}
        disabled={isPending}
        className="mt-8 h-12 w-full cursor-pointer rounded-none text-sm font-semibold uppercase tracking-[0.12em]"
      >
        {isPending ? "Processing…" : `Pay ${formatPrice(total, currency)}`}
      </Button>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[#888888]">
        <Lock size={13} />
        Mock payment — no private data required
      </p>
    </div>
  );
}
