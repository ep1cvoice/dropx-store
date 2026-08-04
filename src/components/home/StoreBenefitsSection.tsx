import { Mail, PackageOpen, Truck } from "lucide-react";
import type { ReactNode } from "react";

import Badge from "@/components/ui/Badge";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/currency";
import { inter } from "@/lib/fonts";

type Benefit = {
  title: string;
  description: ReactNode;
  icon: ReactNode;
  accent?: boolean;
};

const benefits: Benefit[] = [
  {
    title: "Delivery",
    description: `Free delivery on orders over ${FREE_SHIPPING_THRESHOLD}€`,
    icon: <Truck className="size-6" strokeWidth={1.5} aria-hidden />,
  },
  {
    title: "Newsletter",
    description: (
      <>
        <Badge
          variant="discount"
          discountValue={10}
          className="mx-0.5 align-middle"
        />{" "}
        with code MEMBER10 on orders over €400 after you join the drop list.
      </>
    ),
    icon: <Mail className="size-6" strokeWidth={1.5} aria-hidden />,
  },
  {
    title: "Returns",
    description: "You have 30 days to return products",
    icon: <PackageOpen className="size-6" strokeWidth={1.5} aria-hidden />,
    accent: false,
  },
];

export default function StoreBenefitsSection() {
  return (
    <section
      aria-label="Store benefits"
      className={`${inter.className} bg-[#f1f1f1]`}
    >
      <div className="mx-auto grid max-w-[1600px] gap-8 px-6 py-10 md:grid-cols-3 md:gap-6 md:py-12 lg:gap-10 lg:px-10 lg:pt-0">
        {benefits.map((benefit) => (
          <div
            key={benefit.title}
            className={`flex items-start gap-4 ${
              benefit.accent ? "text-[#e85d2a]" : "text-[#121212]"
            }`}
          >
            <span
              className={`flex size-14 shrink-0 items-center justify-center rounded-full ${
                benefit.accent ? "bg-[#e85d2a]/15" : "bg-black/5"
              }`}
            >
              {benefit.icon}
            </span>
            <div className="min-w-0 pt-1">
              <h3 className="text-sm font-bold uppercase tracking-[0.08em]">
                {benefit.title}
              </h3>
              <p
                className={`mt-1.5 text-sm leading-snug ${
                  benefit.accent ? "text-[#e85d2a]/90" : "text-[#121212]/70"
                }`}
              >
                {benefit.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
