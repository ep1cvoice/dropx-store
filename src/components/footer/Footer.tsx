import { anton, inter } from "@/lib/fonts";
import {
  footerColumns,
  footerCopyright,
  footerDescription,
} from "./footer-links";
import { socialIcons } from "./social-icons";

export default function Footer() {
  return (
    <footer className="hidden bg-[#121212] text-white lg:block">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="flex justify-between gap-16">
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

        <div className="mt-14 border-t border-white/10 pt-8">
          <div className="flex items-center justify-between">
            <span
              className={`${inter.className} text-sm text-white/40`}
            >
              {footerCopyright}
            </span>

            <div className="flex items-center gap-5">
              {socialIcons.map(({ label, icon: Icon }) => (
                <span key={label} aria-label={label} className="text-white/70">
                  <Icon />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
