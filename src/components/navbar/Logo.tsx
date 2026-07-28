import Link from "next/link";
import { anton } from "@/lib/fonts";

type LogoProps = {
  className?: string;
};

export default function Logo({ className = "" }: LogoProps) {
  return (
    <Link
      href="/"
      className={`${anton.className} text-2xl uppercase tracking-wide text-white transition-colors hover:text-[#e85d2a] md:text-[28px] lg:text-[32px] ${className}`}
    >
      DROPX
    </Link>
  );
}
