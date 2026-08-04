"use client";

import { UPCOMING_DROP } from "@/lib/upcoming-drop";

/** Native loop of the pre-baked forward+reverse spin (smooth, no seek scrubbing). */
export default function UpcomingDropSpinVideo() {
  return (
    <video
      src={UPCOMING_DROP.videoSrc}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-label={UPCOMING_DROP.videoAlt}
      className="absolute inset-0 h-full w-full scale-[1.08] object-contain"
    />
  );
}
