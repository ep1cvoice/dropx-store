import Link from "next/link";
import { Heart, Search, ShoppingBag } from "lucide-react";
import Logo from "./Logo";
import Button from "../ui/Button";
import { getNavLinkClassName, navIconClassName, navLinks } from "./nav-links";

export default function NavbarDesktop() {
  return (
    <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6 lg:px-10">
      <div className="flex items-center gap-10">
        <Logo />

        <nav className="flex items-center gap-8">
          {navLinks.map(({ href, label, accent }) => (
            <Link
              key={href}
              href={href}
              className={getNavLinkClassName(accent)}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-5">
        <button
          type="button"
          aria-label="Search"
          className="text-white/90 transition-colors hover:text-white"
        >
          <Search className={navIconClassName} strokeWidth={1.75} />
        </button>
        <Link
          href="/wishlist"
          aria-label="Wishlist"
          className="text-white/90 transition-colors hover:text-white"
        >
          <Heart className={navIconClassName} strokeWidth={1.75} />
        </Link>
        <Link
          href="/cart"
          aria-label="Cart"
          className="text-white/90 transition-colors hover:text-white"
        >
          <ShoppingBag className={navIconClassName} strokeWidth={1.75} />
        </Link>
        <Button variant="accent">Sign up</Button>
      </div>
    </div>
  );
}
