import Link from "next/link";
import { SportShoe } from "lucide-react";

import { anton } from "@/lib/fonts";

type LogoProps = {
  className?: string;
  onClick?: () => void;
};

export default function Logo({ className = "", onClick }: LogoProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={`${anton.className} inline-flex items-center gap-2 text-2xl uppercase tracking-wide text-white transition-colors hover:text-[#e85d2a] md:text-[28px] lg:text-[32px] ${className}`}
    >
      <SportShoe
        className="size-[1em] shrink-0"
        strokeWidth={1.75}
        aria-hidden
      />
      DROPX
    </Link>
  );
}
