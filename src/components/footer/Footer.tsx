import { anton, inter } from "@/lib/fonts";
import {
  footerColumns,
  footerCopyright,
  footerDescription,
} from "./footer-links";

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

          {/* Columns: 3 columns on tablet, hidden on mobile */}
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
                      <span
                        className={`${inter.className} text-sm text-white/80`}
                      >
                        {link.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Mobile: compact 2-col link grid */}
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 md:hidden">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <span
                  className={`${inter.className} block text-xs font-medium uppercase tracking-[0.15em] text-white/40`}
                >
                  {column.title}
                </span>
                <ul className="mt-3 space-y-2">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <span
                        className={`${inter.className} text-sm text-white/80`}
                      >
                        {link.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
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
                      <span
                        className={`${inter.className} text-[15px] text-white/90`}
                      >
                        {link.label}
                      </span>
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
            <div className="flex items-center gap-5" />
          </div>
        </div>
      </div>
    </footer>
  );
}
