"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useSyncExternalStore } from "react";

import Button from "@/components/ui/Button";
import { anton, inter } from "@/lib/fonts";
import { ArrowRightIcon, XIcon } from "lucide-react";

const CONSENT_KEY = "dropx_cookie_consent";

type ConsentValue = "accepted" | "rejected" | "custom";

const listeners = new Set<() => void>();

function emitConsentChange() {
  for (const listener of listeners) listener();
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

function getSnapshot() {
  try {
    return window.localStorage.getItem(CONSENT_KEY) == null;
  } catch {
    return true;
  }
}

function getServerSnapshot() {
  return false;
}

export default function CookieBanner() {
  const pathname = usePathname();
  const needsConsent = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  // Let visitors read the policy without the overlay; leaving /privacy
  // without Accept/Reject brings the banner back (consent not stored).
  const visible = needsConsent && pathname !== "/privacy";

  const save = useCallback((value: ConsentValue) => {
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // ignore storage errors in mock
    }
    emitConsentChange();
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end">
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-banner-title"
        aria-describedby="cookie-banner-desc"
        className="relative z-10 w-full p-4 md:p-6"
      >
        <div className="mx-auto w-full max-w-3xl border border-black/10 bg-white p-5 shadow-[0_-8px_40px_rgba(0,0,0,0.12)] md:p-6">
          <p
            className={`${anton.className} text-lg uppercase tracking-wide text-[#121212]`}
          >
            DROPX
          </p>

          <h2
            id="cookie-banner-title"
            className={`${inter.className} mt-3 text-lg font-bold text-[#121212] md:text-xl`}
          >
            We protect your data
          </h2>

          <p
            id="cookie-banner-desc"
            className={`${inter.className} mt-2 text-sm leading-relaxed text-[#555555]`}
          >
            We use cookies to improve your experience and remember preferences.
            See our{" "}
            <Link
              href="/privacy"
              className="font-medium text-[#e85d2a] underline underline-offset-2 transition-opacity hover:opacity-80"
            >
              privacy policy
            </Link>
            .
          </p>

          <div className="mt-5 flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => save("rejected")}
              className="h-11 w-full cursor-pointer rounded-none px-5 text-sm font-semibold sm:w-auto"
            >
              Reject all
              <XIcon className="ml-2 h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="accent"
              onClick={() => save("accepted")}
              className="h-11 w-full cursor-pointer rounded-none px-8 text-sm font-semibold sm:w-auto"
            >
              Accept all and continue
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
