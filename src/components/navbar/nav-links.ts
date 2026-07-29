import { inter } from "@/lib/fonts";

export type NavLink = {
  href: string;
  label: string;
  accent?: boolean;
};

/** All shop filters live on /browse-all — nav links just set query params. */
export const navLinks: NavLink[] = [
  { href: "/browse-all?collection=new-drops", label: "New Drops" },
  { href: "/browse-all", label: "Shop" },
  { href: "/brands", label: "Brands" },
  { href: "/browse-all?collection=sale", label: "Sale" },
  { href: "/browse-all?gender=men", label: "Male" },
  { href: "/browse-all?gender=women", label: "Female" },
  { href: "/about", label: "About" },
];

export const brands = [
  { href: "/browse-all?brand=asics", label: "Asics" },
  { href: "/browse-all?brand=nike", label: "Nike" },
  { href: "/browse-all?brand=adidas", label: "Adidas" },
  { href: "/browse-all?brand=new-balance", label: "New Balance" },
  { href: "/browse-all?brand=puma", label: "Puma" },
  { href: "/browse-all?brand=converse", label: "Converse" },
];

export const navLinkTextClassName =
  "text-lg md:text-[16px] lg:text-[18px]";

export const navIconClassName = "size-[22px] md:size-6 lg:size-[26px]";

export function getNavLinkClassName(accent?: boolean, isActive?: boolean) {
  const color =
    isActive || accent
      ? "text-[#e85d2a] hover:text-[#e85d2a]"
      : "text-white/90 hover:text-[#e85d2a]";

  return `${inter.className} ${navLinkTextClassName} font-medium transition-colors ${color}`;
}

/** Match pathname + query so Male/Sale/etc. highlight correctly on /browse-all. */
export function isNavLinkActive(
  href: string,
  pathname: string,
  search: string,
): boolean {
  const [path, query = ""] = href.split("?");
  const hrefParams = new URLSearchParams(query);
  const currentParams = new URLSearchParams(
    search.startsWith("?") ? search.slice(1) : search,
  );

  if (path === "/browse-all") {
    if (pathname !== "/browse-all") return false;

    const hrefGender = hrefParams.get("gender");
    const hrefCollection = hrefParams.get("collection");

    if (hrefGender) {
      return currentParams.get("gender") === hrefGender;
    }
    if (hrefCollection) {
      return currentParams.get("collection") === hrefCollection;
    }

    // Bare Shop: active only when no gender / collection filter is set.
    return (
      currentParams.get("gender") == null &&
      currentParams.get("collection") == null
    );
  }

  if (path === "/brands") {
    return pathname === "/brands" || pathname.startsWith("/brands/");
  }

  return pathname === path || pathname.startsWith(`${path}/`);
}
