"use client";

import { ChevronDown } from "lucide-react";

import { inter } from "@/lib/fonts";

type HeroScrollCueProps = {
  className?: string;
};

export default function HeroScrollCue({ className = "" }: HeroScrollCueProps) {
  return (
    <a
      href="#upcoming-drop"
      aria-label="Scroll to upcoming drop"
      className={`group absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1.5 pb-1 text-white/80 transition-colors hover:text-[#e85d2a] md:bottom-12 ${className}`}
      onClick={(event) => {
        event.preventDefault();
        document
          .getElementById("upcoming-drop")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    >
      <span
        className={`${inter.className} text-[9px] font-semibold uppercase tracking-[0.32em] md:text-[10px] md:tracking-[0.36em]`}
      >
        Scroll
      </span>
      <span aria-hidden className="flex h-8 flex-col items-center md:h-10">
        <span className="w-px flex-1 bg-current opacity-50" />
        <ChevronDown
          className="size-5 shrink-0 animate-hero-scroll-cue md:size-6"
          strokeWidth={1.75}
        />
      </span>
    </a>
  );
}
