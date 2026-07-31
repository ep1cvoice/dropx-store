"use client";

import { useEffect, useMemo, useState } from "react";

import {
  getCountdownParts,
  type CountdownParts,
} from "@/lib/upcoming-drop";

const EMPTY: CountdownParts = {
  days: "00",
  hours: "00",
  minutes: "00",
  seconds: "00",
  isExpired: false,
};

/** Live countdown to an ISO target. Stable zeros on SSR/first paint to avoid hydration mismatch. */
export function useCountdown(targetIso: string): CountdownParts {
  const targetMs = useMemo(() => new Date(targetIso).getTime(), [targetIso]);
  const [parts, setParts] = useState<CountdownParts>(EMPTY);

  useEffect(() => {
    if (!Number.isFinite(targetMs)) return;

    const tick = () => setParts(getCountdownParts(targetMs, Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [targetMs]);

  return parts;
}
