"use client";

import Link from "next/link";
import { Heart, LogOut, Menu, ShoppingBag, User, X } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type TransitionEvent,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
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

const PANEL_MS = 300;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function NavbarMobile() {
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);
  const menuId = useId();
  const { status } = useSession();
  const { cartCount, wishlistCount } = useStoreBag();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlKey = `${pathname}?${searchParams.toString()}`;
  const urlKeyOnOpenRef = useRef(urlKey);

  useEffect(() => {
    document.body.style.overflow = mounted ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, [mounted]);

  // Male/Female keep pathname /browse-all — only the query changes. Always
  // tear the drawer down on any URL change so the overlay can't stick.
  useEffect(() => {
    if (!mounted) return;
    if (urlKey === urlKeyOnOpenRef.current) return;
    setEntered(false);
    setMounted(false);
  }, [urlKey, mounted]);

  // Backup if transitionend never fires (reduced motion, interrupted nav).
  useEffect(() => {
    if (!mounted || entered) return;
    if (prefersReducedMotion()) {
      setMounted(false);
      return;
    }
    const t = window.setTimeout(() => setMounted(false), PANEL_MS + 50);
    return () => window.clearTimeout(t);
  }, [mounted, entered]);

  function openMenu() {
    urlKeyOnOpenRef.current = urlKey;
    setMounted(true);
  }

  function closeMenu() {
    setEntered(false);
    if (prefersReducedMotion()) setMounted(false);
  }

  function onPanelTransitionEnd(event: TransitionEvent<HTMLElement>) {
    if (event.propertyName !== "transform") return;
    if (!entered) setMounted(false);
  }

  return (
    <>
      <div className="flex h-14 items-center justify-between px-6 md:h-[68px]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={entered}
            aria-controls={menuId}
            onClick={openMenu}
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

      {mounted && (
        <div
          className={`fixed inset-0 z-50 ${entered ? "" : "pointer-events-none"}`}
        >
          <button
            type="button"
            aria-label="Close menu"
            tabIndex={entered ? 0 : -1}
            className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
              entered ? "opacity-100" : "opacity-0"
            }`}
            onClick={closeMenu}
          />

          <nav
            id={menuId}
            onTransitionEnd={onPanelTransitionEnd}
            className={`absolute left-0 top-0 flex h-full w-full max-w-xs flex-col bg-[#121212] p-6 shadow-xl transition-transform ease-out motion-reduce:transition-none ${
              entered ? "translate-x-0" : "-translate-x-full"
            }`}
            style={{ transitionDuration: `${PANEL_MS}ms` }}
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
                  variant="outline"
                  className="w-full cursor-pointer"
                >
                  <ShoppingBag size={18} strokeWidth={1.75} />
                  Cart
                  {cartCount > 0 ? <span>({cartCount})</span> : null}
                </Button>
              </Link>
              <Link
                href="/account/wishlist"
                onClick={closeMenu}
                className="block"
              >
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
