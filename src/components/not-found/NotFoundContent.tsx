import Link from "next/link";
import { anton, inter } from "@/lib/fonts";
import Button from "@/components/ui/Button";

export default function NotFoundContent() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center bg-[#07090c] px-6 py-24 text-center">
      {/* Eyebrow */}
      <p
        className={`${inter.className} text-[10px] font-semibold uppercase tracking-[0.28em] text-[#e85d2a] md:text-[11px]`}
      >
        Error 404
      </p>

      {/* Giant 404 */}
      <h1
        className={`${anton.className} mt-4 select-none text-[120px] leading-none tracking-tight text-white sm:text-[160px] md:text-[200px] lg:text-[240px]`}
        aria-hidden="true"
      >
        <span className="text-[#e85d2a]">4</span>
        <span>0</span>
        <span className="text-[#e85d2a]">4</span>
      </h1>

      {/* Headline */}
      <h2
        className={`${anton.className} mt-2 text-[28px] uppercase tracking-[0.04em] text-white sm:text-[36px] md:text-[44px]`}
      >
        Page Not Found
      </h2>

      {/* Description */}
      <p
        className={`${inter.className} mt-5 max-w-[420px] text-[13px] font-medium leading-relaxed text-white/40 md:text-[14px]`}
      >
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Head back home and keep browsing the latest drops.
      </p>

      {/* CTA */}
      <Link href="/" className="mt-8">
        <Button
          variant="accent"
          className="cursor-pointer rounded-none px-10 py-3.5 text-sm font-semibold uppercase tracking-[0.14em]"
        >
          Back to Home
        </Button>
      </Link>
    </section>
  );
}
