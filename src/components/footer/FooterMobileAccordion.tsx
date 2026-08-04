"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";

import { inter } from "@/lib/fonts";
import { footerColumns, type FooterLink } from "./footer-links";

function AccordionLink({ link }: { link: FooterLink }) {
  const className = `${inter.className} block py-2 text-sm text-white/70 transition-colors hover:text-white`;

  if (!link.href) {
    return <span className={className}>{link.label}</span>;
  }

  if (link.href.startsWith("mailto:")) {
    return (
      <a href={link.href} className={className}>
        {link.label}
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  );
}

export default function FooterMobileAccordion() {
  const baseId = useId();
  const [openTitle, setOpenTitle] = useState<string | null>(null);

  return (
    <div className="mt-8 border-t border-white/10 md:hidden">
      {footerColumns.map((column) => {
        const isOpen = openTitle === column.title;
        const panelId = `${baseId}-${column.title}`;

        return (
          <div key={column.title} className="border-b border-white/10">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() =>
                setOpenTitle((current) =>
                  current === column.title ? null : column.title,
                )
              }
              className={`${inter.className} flex w-full cursor-pointer items-center justify-between py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-white`}
            >
              {column.title}
              <ChevronDown
                size={18}
                strokeWidth={1.75}
                aria-hidden
                className={`shrink-0 text-white/70 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              id={panelId}
              hidden={!isOpen}
              className={isOpen ? "pb-3" : undefined}
            >
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <AccordionLink link={link} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}
