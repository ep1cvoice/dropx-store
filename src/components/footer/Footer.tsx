import Link from "next/link";

import { anton, inter } from "@/lib/fonts";
import FooterMobileAccordion from "./FooterMobileAccordion";
import {
  footerColumns,
  footerCopyright,
  footerDescription,
  type FooterLink,
} from "./footer-links";

function FooterNavLink({ link }: { link: FooterLink }) {
  const className = `${inter.className} text-sm text-white/80 transition-colors hover:text-white lg:text-[15px] lg:text-white/90`;

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

export default function Footer() {
  return (
    <footer className="bg-[#121212] text-white">
      <div className="mx-auto max-w-[1600px] px-6 py-10 md:py-14 lg:px-10 lg:py-16">
        {/* ── Mobile: logo + description ── */}
        <div className="lg:hidden">
          <span
            className={`${anton.className} block text-2xl uppercase tracking-wide md:text-[28px]`}
          >
            DROPX
          </span>
          <p
            className={`${inter.className} mt-3 max-w-xs text-sm leading-relaxed text-white/50`}
          >
            {footerDescription}
          </p>

          {/* Tablet: 3-column link grid */}
          <div className="mt-10 hidden grid-cols-3 gap-8 md:grid">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <span
                  className={`${inter.className} block text-xs font-medium uppercase tracking-[0.15em] text-white/40`}
                >
                  {column.title}
                </span>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <FooterNavLink link={link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Mobile: Sizeer-style accordion */}
          <FooterMobileAccordion />
        </div>

        {/* ── Desktop: original layout ── */}
        <div className="hidden lg:flex lg:justify-between lg:gap-16">
          <div className="max-w-xs shrink-0">
            <span
              className={`${anton.className} block text-[32px] uppercase tracking-wide`}
            >
              DROPX
            </span>
            <p
              className={`${inter.className} mt-4 text-sm leading-relaxed text-white/50`}
            >
              {footerDescription}
            </p>
          </div>

          <div className="flex gap-16 xl:gap-24">
            {footerColumns.map((column) => (
              <div key={column.title} className="min-w-[120px]">
                <span
                  className={`${inter.className} block text-xs font-medium uppercase tracking-[0.15em] text-white/40`}
                >
                  {column.title}
                </span>
                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <FooterNavLink link={link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom bar: all breakpoints ── */}
        <div className="mt-10 border-t border-white/10 pt-6 md:mt-12 lg:mt-14 lg:pt-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <span
              className={`${inter.className} text-xs text-white/40 md:text-sm`}
            >
              {footerCopyright}
            </span>
            <div className="flex items-center gap-5">
              <Link
                href="/about"
                className={`${inter.className} text-xs text-white/40 transition-colors hover:text-white md:text-sm`}
              >
                About
              </Link>
              <Link
                href="/privacy"
                className={`${inter.className} text-xs text-white/40 transition-colors hover:text-white md:text-sm`}
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
