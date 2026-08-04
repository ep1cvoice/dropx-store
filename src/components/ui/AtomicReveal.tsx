"use client";

import { useEffect, useState, type ReactNode } from "react";

type AtomicRevealProps = {
  children: ReactNode;
  /** Shown until hydration — prefer a skeleton over a text loader for grids. */
  fallback: ReactNode;
  /** Optional class on the revealed content wrapper. */
  className?: string;
};

/**
 * Avoids progressive HTML paint of large product grids: keep content hidden
 * until the client has hydrated, then reveal everything at once.
 */
export default function AtomicReveal({
  children,
  fallback,
  className = "",
}: AtomicRevealProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <>
      {!ready && <div aria-hidden={ready}>{fallback}</div>}
      <div className={ready ? className : "hidden"} aria-hidden={!ready}>
        {children}
      </div>
    </>
  );
}
