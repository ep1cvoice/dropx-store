"use client";

import Link from "next/link";
import { Mail, Phone, RefreshCw, Truck } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { FREE_SHIPPING_THRESHOLD } from "@/lib/currency";
import { inter } from "@/lib/fonts";

const CONTACT_PHONE = "+48 500 284 119";
const CONTACT_EMAIL = "hello@dropx.store";

const iconClassName = "size-3.5 shrink-0 opacity-90 md:size-4";

const promoItems: { label: string; icon: ReactNode }[] = [
  {
    label: `Free shipping over ${FREE_SHIPPING_THRESHOLD}€`,
    icon: <Truck className={iconClassName} strokeWidth={1.75} aria-hidden />,
  },
  {
    label: "30 days return policy",
    icon: <RefreshCw className={iconClassName} strokeWidth={1.75} aria-hidden />,
  },
];

export default function TopBar() {
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    function update() {
      setAtTop(window.scrollY <= 2);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      aria-hidden={!atTop}
      className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out ${
        atTop ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      }`}
    >
      <div className="min-h-0">
        <div
          className={`${inter.className} border-b border-black/10 bg-[#6b6b6b] text-[11px] text-white/85 md:text-xs`}
        >
          <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-2 md:px-6 lg:px-10">
            <ul className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 sm:gap-x-5">
              {promoItems.map((item) => (
                <li key={item.label} className="flex items-center gap-3 sm:gap-5">
                  <span className="inline-flex items-center gap-1.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </span>
                  <span aria-hidden="true" className="text-white/30">
                    |
                  </span>
                </li>
              ))}
              <li>
                <Link
                  href="/#newsletter"
                  tabIndex={atTop ? undefined : -1}
                  className="inline-flex items-center gap-1.5 font-medium text-white/85 transition-colors hover:text-[#e85d2a]"
                >
                  <Mail className={iconClassName} strokeWidth={1.75} aria-hidden />
                  Newsletter — 10%
                </Link>
              </li>
            </ul>

            <div className="hidden shrink-0 items-center gap-5 md:flex">
              <span className="inline-flex items-center gap-1.5">
                <Phone className={iconClassName} strokeWidth={1.75} aria-hidden />
                {CONTACT_PHONE}
              </span>
              <span aria-hidden="true" className="text-white/30">
                |
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Mail className={iconClassName} strokeWidth={1.75} aria-hidden />
                {CONTACT_EMAIL}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
