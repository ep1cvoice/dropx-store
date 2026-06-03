import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { inter } from "@/lib/fonts";

type BackToHomeLinkProps = {
  className?: string;
  theme?: "light" | "dark";
};

export default function BackToHomeLink({
  className = "",
  theme = "light",
}: BackToHomeLinkProps) {
  const colorClass =
    theme === "dark"
      ? "text-gray-900 hover:text-gray-700"
      : "text-white/90 hover:text-white lg:gap-2.5 lg:text-base xl:text-lg";

  return (
    <Link
      href="/"
      className={`${inter.className} inline-flex items-center gap-2 text-sm transition-colors ${colorClass} ${className}`}
    >
      <ArrowLeft
        className={`size-[18px] ${theme === "light" ? "lg:size-[22px] xl:size-6" : ""}`}
        strokeWidth={1.75}
        aria-hidden
      />
      Back to Home Page
    </Link>
  );
}
