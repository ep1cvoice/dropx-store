"use client";

import { useEffect } from "react";

/** Smooth-scroll to #newsletter when the URL hash requests it (e.g. from TopBar on other pages). */
export default function ScrollToNewsletterHash() {
  useEffect(() => {
    function scrollToNewsletter() {
      if (window.location.hash !== "#newsletter") return;
      document
        .getElementById("newsletter")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Wait a tick so the home layout is painted after client navigation.
    const timeout = window.setTimeout(scrollToNewsletter, 50);
    window.addEventListener("hashchange", scrollToNewsletter);

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("hashchange", scrollToNewsletter);
    };
  }, []);

  return null;
}
