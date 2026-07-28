import Link from "next/link";
import { Check } from "lucide-react";

import { inter } from "@/lib/fonts";

const STEPS = [
  {
    id: 1 as const,
    label: "Information",
    href: "/checkout",
  },
  {
    id: 2 as const,
    label: "Payment",
    href: "/checkout/payment",
  },
  {
    id: 3 as const,
    label: "Confirmation",
    href: null,
  },
] as const;

type CheckoutStepsProps = {
  /** 1 = Information, 2 = Payment, 3 = Confirmation. */
  current?: number;
  /** Payment step is reachable only after information is saved. */
  paymentEnabled?: boolean;
};

export default function CheckoutSteps({
  current = 1,
  paymentEnabled = false,
}: CheckoutStepsProps) {
  // After confirmation, lock the flow — no going back to edit.
  const navigationLocked = current >= 3;

  return (
    <ol
      className={`${inter.className} mx-auto flex w-full max-w-[560px] items-center`}
    >
      {STEPS.map((step, index) => {
        const isComplete = step.id < current;
        const isActive = step.id === current;
        const isLast = index === STEPS.length - 1;

        const canNavigate =
          !navigationLocked &&
          !isActive &&
          ((step.id === 1 && current === 2) ||
            (step.id === 2 && paymentEnabled));

        const content = (
          <div className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-none text-xs font-semibold ${
                isActive || isComplete
                  ? "bg-[#121212] text-white"
                  : "border border-black/20 text-[#999999]"
              }`}
            >
              {isComplete ? <Check size={13} /> : step.id}
            </span>
            <span
              className={`text-sm ${
                isActive
                  ? "font-semibold text-[#121212]"
                  : canNavigate
                    ? "text-[#666666]"
                    : "text-[#999999]"
              }`}
            >
              {step.label}
            </span>
          </div>
        );

        return (
          <li
            key={step.id}
            className={`flex items-center ${isLast ? "" : "flex-1"}`}
          >
            {canNavigate && step.href ? (
              <Link
                href={step.href}
                className="rounded-none transition-colors hover:opacity-80"
              >
                {content}
              </Link>
            ) : (
              content
            )}

            {!isLast && (
              <span
                aria-hidden="true"
                className="mx-3 h-px flex-1 bg-black/15"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
