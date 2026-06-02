import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { inter } from "@/lib/fonts";

type BackToHomeLinkProps = {
  className?: string;
};

export default function BackToHomeLink({ className = "" }: BackToHomeLinkProps) {
  return (
    <Link
      href="/"
      className={`${inter.className} inline-flex items-center gap-2 text-sm text-white/90 transition-colors hover:text-white lg:gap-2.5 lg:text-base xl:text-lg ${className}`}
    >
      <ArrowLeft
        className="size-[18px] lg:size-[22px] xl:size-6"
        strokeWidth={1.75}
        aria-hidden
      />
      Back to Home Page
    </Link>
  );
}
