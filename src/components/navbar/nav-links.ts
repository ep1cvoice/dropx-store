import { inter } from "@/lib/fonts";

export type NavLink = {
  href: string;
  label: string;
  accent?: boolean;
};

export const navLinks: NavLink[] = [
  { href: "/new-drops", label: "New Drops" },
  { href: "/brands", label: "Brands" },
  { href: "/sale", label: "Sale", accent: true },
  { href: "/about", label: "About" },
];

export const navLinkTextClassName =
  "text-lg md:text-[16px] lg:text-[18px]";

export const navIconClassName = "size-[22px] md:size-6 lg:size-[26px]";

export function getNavLinkClassName(accent?: boolean) {
  const color = accent
    ? "text-[#c9664a] hover:text-[#db7a5e]"
    : "text-white/90 hover:text-white";

  return `${inter.className} ${navLinkTextClassName} font-medium transition-colors ${color}`;
}
