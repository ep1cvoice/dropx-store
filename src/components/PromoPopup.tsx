"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { XIcon } from "lucide-react";

/** Session stored for the promo popup. */
const PROMO_SESSION_KEY = "dropx_promo_sb_dunk";
/** Local storage for the cookie consent. */
const COOKIE_CONSENT_KEY = "dropx_cookie_consent";
/** Shop href for the promo popup. */
const SHOP_HREF = "/products/nike-sb-dunk-low-limited-colorways";

function alreadySeen(): boolean {
  try {
    return window.sessionStorage.getItem(PROMO_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function cookiePending(): boolean {
  try {
    return !window.localStorage.getItem(COOKIE_CONSENT_KEY);
  } catch {
    return false;
  }
}

export default function PromoPopup() {
  const pathname = usePathname();
  const onPrivacy = pathname === "/privacy";
  const [visible, setVisible] = useState(false);
  const show = visible && !onPrivacy;

  // Schedule promo after cookie consent; re-run when leaving /privacy so a
  // policy detour doesn't permanently skip the ad for the session.
  useEffect(() => {
    if (onPrivacy) {
      setVisible(false);
      return;
    }

    let cancelled = false;
    let retryTimer: number | undefined;
    let showTimer: number | undefined;

    function open() {
      if (cancelled || alreadySeen()) return;
      if (window.location.pathname === "/privacy") return;
      setVisible(true);
    }

    if (alreadySeen()) return;

    const started = Date.now();
    const MAX_WAIT_MS = 8000;

    function tryWhenReady() {
      if (cancelled || alreadySeen()) return;

      if (cookiePending() && Date.now() - started < MAX_WAIT_MS) {
        retryTimer = window.setTimeout(tryWhenReady, 350);
        return;
      }

      if (cookiePending()) return;

      showTimer = window.setTimeout(open, 450);
    }

    tryWhenReady();

    return () => {
      cancelled = true;
      if (retryTimer != null) window.clearTimeout(retryTimer);
      if (showTimer != null) window.clearTimeout(showTimer);
    };
  }, [onPrivacy, pathname]);

  useEffect(() => {
    if (!show) return;

    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") dismiss();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [show]);

  function dismiss() {
    try {
      window.sessionStorage.setItem(PROMO_SESSION_KEY, "1");
    } catch {
      // ignore
    }
    setVisible(false);
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Dismiss promotion"
        onClick={dismiss}
        className="absolute inset-0 cursor-pointer bg-black/70"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="promo-popup-title"
        className="relative z-10 w-full max-w-[520px] bg-[#f4f1ec] shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-2 top-2 z-20 flex h-9 w-9 cursor-pointer items-center justify-center bg-black/80 text-white transition-colors hover:bg-black"
        >
          <XIcon className="h-4 w-4" strokeWidth={2.2} />
        </button>

        <h2 id="promo-popup-title" className="sr-only">
          Nike SB Dunk — limited colorways
        </h2>

        <Link
          href={SHOP_HREF}
          onClick={dismiss}
          className="relative block cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#121212] focus-visible:ring-offset-2"
        >
          <Image
            src="/nike-sb-dunk-limited.jpeg"
            alt="Nike SB Dunk limited colorways — shop now"
            width={1040}
            height={1040}
            priority
            className="h-auto w-full"
            sizes="(max-width: 560px) 92vw, 520px"
          />
        </Link>
      </div>
    </div>
  );
}
