"use client";

import { useEffect } from "react";

/**
 * Syncs the real visible viewport + sticky header into CSS vars so the hero
 * fits above OS taskbars / browser chrome on first paint (Windows, iOS, etc.).
 */
export default function HeroViewportSync() {
  useEffect(() => {
    const root = document.documentElement;
    const header = document.querySelector("header");

    function update() {
      const vv = window.visualViewport;
      const vh = vv?.height ?? window.innerHeight;
      root.style.setProperty("--app-vh", `${Math.round(vh)}px`);

      if (header instanceof HTMLElement) {
        root.style.setProperty(
          "--site-header-height",
          `${Math.round(header.getBoundingClientRect().height)}px`,
        );
      }
    }

    update();

    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);
    window.visualViewport?.addEventListener("scroll", update);

    const ro =
      header instanceof HTMLElement ? new ResizeObserver(update) : null;
    if (header instanceof HTMLElement) ro?.observe(header);

    return () => {
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("scroll", update);
      ro?.disconnect();
    };
  }, []);

  return null;
}
