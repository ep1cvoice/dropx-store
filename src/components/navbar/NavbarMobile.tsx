"use client";

import Link from "next/link";
import { Heart, LogOut, Menu, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import Button from "@/components/ui/Button";
import { signOut, useSession } from "next-auth/react";
import Logo from "./Logo";
import NavCountBadge from "./NavCountBadge";
import NavSearch from "./NavSearch";
import { getNavLinkClassName, navIconClassName, navLinks } from "./nav-links";
import { useStoreBag } from "@/components/providers/StoreBagProvider";

const iconButtonClassName =
  "cursor-pointer text-white/60 transition-colors duration-200 hover:text-[#e85d2a] active:text-[#e85d2a]";

const navbarIconClassName =
  "cursor-pointer text-white/90 transition-colors duration-200 hover:text-[#e85d2a] active:text-[#e85d2a]";

export default function NavbarMobile() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const { status } = useSession();
  const { cartCount, wishlistCount } = useStoreBag();

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
      <div className="flex h-14 items-center justify-between px-6 md:h-[68px]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen(true)}
            className={navbarIconClassName}
          >
            <Menu className={navIconClassName} strokeWidth={1.75} />
          </button>
          <Logo />
        </div>

        <div className="flex items-center gap-4">
          <NavSearch triggerClassName={navbarIconClassName} />
          <Link
            href="/cart"
            aria-label={cartCount > 0 ? `Cart, ${cartCount} items` : "Cart"}
            className={navbarIconClassName + " relative"}
          >
            <ShoppingBag className={navIconClassName} strokeWidth={1.75} />
            <NavCountBadge count={cartCount} />
          </Link>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/60 transition-opacity duration-300"
            onClick={closeMenu}
          />

          <nav
            id={menuId}
            className="relative flex h-full w-full max-w-xs flex-col bg-[#121212] p-6 shadow-xl"
          >
            <div className="mb-8 flex items-center justify-between">
              <Logo onClick={closeMenu} />
              <button
                type="button"
                aria-label="Close menu"
                onClick={closeMenu}
                className={iconButtonClassName}
              >
                <X className={navIconClassName} strokeWidth={1.75} />
              </button>
            </div>

            <ul className="flex flex-col">
              {navLinks.map(({ href, label, accent }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={closeMenu}
                    className={
                      getNavLinkClassName(accent) +
                      " block cursor-pointer rounded-none px-3 py-3 transition-colors duration-150 hover:bg-white/5 active:bg-white/10"
                    }
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-auto space-y-3 border-t border-white/10 pt-6">
              <Link href="/cart" onClick={closeMenu} className="block">
                <Button
                  type="button"
                  variant="accent"
                  className="w-full cursor-pointer"
                >
                  <ShoppingBag size={18} strokeWidth={1.75} />
                  Cart
                  {cartCount > 0 ? <span>({cartCount})</span> : null}
                </Button>
              </Link>
              <Link href="/account/wishlist" onClick={closeMenu} className="block">
                <Button
                  type="button"
                  className="w-full cursor-pointer border border-white/20 bg-transparent text-white hover:bg-white/10 active:bg-white/20"
                >
                  <Heart size={18} strokeWidth={1.75} />
                  Wishlist
                  {wishlistCount > 0 ? (
                    <span className="text-white/50">({wishlistCount})</span>
                  ) : null}
                </Button>
              </Link>

              {status === "authenticated" ? (
                <>
                  <Link href="/account" onClick={closeMenu} className="block">
                    <Button
                      type="button"
                      className="w-full cursor-pointer border border-white/20 bg-transparent text-white hover:bg-white/10 active:bg-white/20"
                    >
                      <User size={18} strokeWidth={1.75} />
                      My Account
                    </Button>
                  </Link>
                  <Button
                    type="button"
                    onClick={async () => {
                      closeMenu();
                      await signOut({ callbackUrl: "/" });
                    }}
                    className="w-full cursor-pointer border border-white bg-transparent text-white hover:bg-white/10 active:bg-white/20"
                  >
                    <LogOut size={18} strokeWidth={1.75} />
                    Log out
                  </Button>
                </>
              ) : (
                <Link href="/login" onClick={closeMenu} className="block">
                  <Button variant="accent" className="w-full cursor-pointer">
                    Sign in
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
