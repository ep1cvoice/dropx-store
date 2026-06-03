import Image from "next/image";
import BackToHomeLink from "@/components/auth/BackToHomeLink";
import { anton, inter } from "@/lib/fonts";

type AuthSplitLayoutProps = {
  heroSrc: string;
  tagline: string;
  mobileDescription?: string;
  children: React.ReactNode;
};

function HeroText({
  tagline,
  className = "",
}: {
  tagline: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <span
        className={`${anton.className} block text-2xl uppercase tracking-wide text-white`}
      >
        DROPX
      </span>
      <p
        className={`${anton.className} mt-1.5 text-xl uppercase leading-none tracking-wide text-[#e85d2a]`}
      >
        {tagline}
      </p>
    </div>
  );
}

export default function AuthSplitLayout({
  heroSrc,
  tagline,
  mobileDescription,
  children,
}: AuthSplitLayoutProps) {
  return (
    <div className="flex h-dvh max-h-dvh overflow-hidden flex-col bg-white md:flex-row">
      {/* Hero: top on mobile, left on tablet+ */}
      <section className="relative shrink-0 md:h-dvh md:w-[38%] md:min-w-[280px] md:max-w-[480px] lg:w-1/2 lg:max-w-none">
        <BackToHomeLink className="absolute left-6 top-6 z-20 md:left-8 md:top-8 lg:left-10 lg:top-10" />

        {/* Mobile: image bg, branding at bottom of banner */}
        <div className="relative flex h-44 flex-col justify-end px-6 pb-6 md:hidden">
          <Image
            src={heroSrc}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/45" />
          <HeroText tagline={tagline} className="relative z-10" />
          {mobileDescription && (
            <p
              className={`${inter.className} relative z-10 mt-2 max-w-[260px] text-xs leading-relaxed text-white/50`}
            >
              {mobileDescription}
            </p>
          )}
        </div>

        {/* Tablet & desktop */}
        <div className="relative hidden h-dvh md:block">
          <Image
            src={heroSrc}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 38vw, 50vw"
          />
          <div className="absolute inset-0 bg-black/25" />

          <div className="absolute bottom-10 left-8 z-10 text-white lg:hidden">
            <span
              className={`${anton.className} block text-[40px] uppercase leading-none tracking-wide`}
            >
              DROPX
            </span>
            <p
              className={`${anton.className} mt-3 text-[28px] uppercase leading-none tracking-wide text-[#e85d2a]`}
            >
              {tagline}
            </p>
          </div>

          <div className="absolute inset-0 z-10 hidden flex-col items-center justify-center px-8 text-center text-white lg:flex">
            <span
              className={`${anton.className} block text-[56px] uppercase leading-none tracking-wide xl:text-[64px]`}
            >
              DROPX
            </span>
            <p
              className={`${anton.className} mt-4 text-[36px] uppercase leading-none tracking-wide text-[#e85d2a] xl:text-[40px]`}
            >
              {tagline}
            </p>
          </div>
        </div>
      </section>

      {/* Form: below hero on mobile, right on desktop */}
      <section className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pb-4 pt-5 md:h-dvh md:justify-center md:overflow-hidden md:px-8 md:py-6 md:pb-6 lg:px-16 lg:py-8 xl:px-20">
        {children}
      </section>
    </div>
  );
}
