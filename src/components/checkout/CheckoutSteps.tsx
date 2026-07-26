import { Check } from "lucide-react";

import { inter } from "@/lib/fonts";

const STEPS = [
  { id: 1, label: "Information" },
  { id: 2, label: "Payment" },
  { id: 3, label: "Confirmation" },
] as const;

type CheckoutStepsProps = {
  /** 1 = Information, 2 = Payment, 3 = Confirmation. */
  current?: number;
};

export default function CheckoutSteps({ current = 1 }: CheckoutStepsProps) {
  return (
    <ol
      className={`${inter.className} mx-auto flex w-full max-w-[560px] items-center`}
    >
      {STEPS.map((step, index) => {
        const isComplete = step.id < current;
        const isActive = step.id === current;
        const isLast = index === STEPS.length - 1;

        return (
          <li
            key={step.id}
            className={`flex items-center ${isLast ? "" : "flex-1"}`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  isActive
                    ? "bg-[#121212] text-white"
                    : isComplete
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
                    : "text-[#999999]"
                }`}
              >
                {step.label}
              </span>
            </div>

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
