/** Single source of truth for the homepage drop countdown. */
export const UPCOMING_DROP = {
  titleLine1: "Air Max 90",
  titleLine2: "'Infrared' OG",
  /** Fixed future drop — CET. Change this date when you want a new campaign. */
  dropsAt: "2026-10-15T10:00:00+02:00",
  displayDate: "October 15, 2026 — 10:00 CET",
  heroEyebrow: "Exclusive Drop — Fall 2026",
  imageSrc: "/dropAirMax.jpg",
  imageAlt: "Nike Air Max 90 Infrared OG",
  shopHref: "/browse-all?collection=new-drops",
} as const;

export type CountdownParts = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  isExpired: boolean;
};

function pad(value: number): string {
  return String(Math.max(0, value)).padStart(2, "0");
}

export function getCountdownParts(
  targetMs: number,
  nowMs: number,
): CountdownParts {
  const totalMs = targetMs - nowMs;

  if (totalMs <= 0) {
    return {
      days: "00",
      hours: "00",
      minutes: "00",
      seconds: "00",
      isExpired: true,
    };
  }

  const totalSec = Math.floor(totalMs / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  return {
    days: pad(days),
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds),
    isExpired: false,
  };
}

export function countdownUnits(parts: CountdownParts) {
  return [
    { value: parts.days, label: "Days" },
    { value: parts.hours, label: "Hrs" },
    { value: parts.minutes, label: "Min" },
    { value: parts.seconds, label: "Sec" },
  ] as const;
}
