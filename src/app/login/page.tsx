import Image from "next/image";
import BackToHomeLink from "@/components/auth/BackToHomeLink";
import LoginForm from "@/components/auth/LoginForm";
import { anton, inter } from "@/lib/fonts";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-white md:flex-row">
      <section className="relative bg-[#121212] md:min-h-dvh md:w-[38%] md:min-w-[280px] md:max-w-[480px] md:shrink-0 lg:w-1/2 lg:max-w-none">
        <BackToHomeLink className="absolute left-6 top-6 z-20 md:left-8 md:top-8 lg:left-10 lg:top-10" />

        <div className="px-6 pb-10 pt-16 text-white md:hidden">
          <span
            className={`${anton.className} block text-[32px] uppercase tracking-wide`}
          >
            DROPX
          </span>
          <h1
            className={`${anton.className} mt-6 text-[32px] uppercase leading-none tracking-wide text-[#e85d2a]`}
          >
            Welcome back.
          </h1>
          <p
            className={`${inter.className} mt-4 max-w-[280px] text-sm leading-relaxed text-white/50`}
          >
            Sign in to access your account, track orders, and never miss a
            drop.
          </p>
        </div>

        <div className="relative hidden min-h-dvh md:block">
          <Image
            src="/loginHero.jpg"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 38vw, 50vw"
          />
          <div className="absolute inset-0 bg-black/25" />

          {/* Tablet: text bottom-left */}
          <div className="absolute bottom-10 left-8 z-10 text-white lg:hidden">
            <span
              className={`${anton.className} block text-[40px] uppercase leading-none tracking-wide`}
            >
              DROPX
            </span>
            <p
              className={`${anton.className} mt-3 text-[28px] uppercase leading-none tracking-wide text-[#e85d2a]`}
            >
              Welcome back.
            </p>
          </div>

          {/* Desktop: text centered */}
          <div className="absolute inset-0 z-10 hidden flex-col items-center justify-center px-8 text-center text-white lg:flex">
            <span
              className={`${anton.className} block text-[56px] uppercase leading-none tracking-wide xl:text-[64px]`}
            >
              DROPX
            </span>
            <p
              className={`${anton.className} mt-4 text-[36px] uppercase leading-none tracking-wide text-[#e85d2a] xl:text-[40px]`}
            >
              Welcome back.
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-1 flex-col px-6 pb-10 pt-8 md:justify-center md:px-8 md:py-12 lg:px-20 lg:py-16 xl:px-24">
        <LoginForm
          showSubtitle
          className="mx-auto flex w-full max-w-md flex-1 flex-col md:flex-none lg:max-w-lg"
        />
      </section>
    </div>
  );
}
