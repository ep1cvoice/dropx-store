"use client";

import Link from "next/link";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import Button from "@/components/ui/Button";
import Logo from "./Logo";
import { getNavLinkClassName, navIconClassName, navLinks } from "./nav-links";

const iconButtonClassName =
  "text-white/90 transition-colors hover:text-white";

export default function NavbarMobile() {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <>
      <div className="grid h-14 grid-cols-3 items-center px-6 md:h-[68px]">
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen(true)}
          className="justify-self-start text-white/90 transition-colors hover:text-white"
        >
          <Menu className={navIconClassName} strokeWidth={1.75} />
        </button>

        <Logo className="justify-self-center" />

        <Link
          href="/cart"
          aria-label="Cart"
          className="justify-self-end text-white/90 transition-colors hover:text-white"
        >
          <ShoppingBag className={navIconClassName} strokeWidth={1.75} />
        </Link>
      </div>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/60"
            onClick={closeMenu}
          />

          <nav
            id={menuId}
            className="relative flex h-full w-full max-w-xs flex-col bg-[#121212] p-6 shadow-xl"
          >
            
            <div className="mb-8 flex items-center justify-between">
              <span className="text-base font-bold tracking-[0.08em] uppercase text-white">
              <Logo />
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={closeMenu}
                className={iconButtonClassName}
              >
                <X className={navIconClassName} strokeWidth={1.75} />
              </button>
            </div>

            <ul className="flex flex-col gap-6">
              {navLinks.map(({ href, label, accent }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={closeMenu}
                    className={getNavLinkClassName(accent)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-auto space-y-6 border-t border-white/10 pt-6">
              <div className="flex items-center gap-10 center
              justify-center">
                <button
                  type="button"
                  aria-label="Search"
                  className={iconButtonClassName}
                >
                  <Search className={navIconClassName} strokeWidth={1.75} />
                </button>
                <Link
                  href="/wishlist"
                  aria-label="Wishlist"
                  onClick={closeMenu}
                  className={iconButtonClassName}
                >
                  <Heart className={navIconClassName} strokeWidth={1.75} />
                </Link>
                <Link
                  href="/cart"
                  aria-label="Cart"
                  onClick={closeMenu}
                  className={iconButtonClassName}
                >
                  <ShoppingBag className={navIconClassName} strokeWidth={1.75} />
                </Link>
              </div>

              <Link href="/login" onClick={closeMenu} className="block">
                <Button variant="accent" className="w-full cursor-pointer">
                  Sign in
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
