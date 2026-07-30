import Link from "next/link";

import { anton, inter } from "@/lib/fonts";

const pillars = [
  {
    title: "Drops first",
    body: "We chase limited releases, restocks, and colorways that disappear fast — not endless generic stock.",
  },
  {
    title: "Curated brands",
    body: "Nike, Adidas, New Balance, Asics, Puma, Converse and more — picked for culture, not clutter.",
  },
  {
    title: "Member perks",
    body: "Join the drop list for early signals and unlock MEMBER10 — 10% off when your order hits €400.",
  },
] as const;

export default function About() {
  return (
    <div className="min-h-[70vh] bg-white">
      <div className="border-b border-black/5 bg-[#121212]">
        <div className="mx-auto w-full max-w-[900px] px-4 py-14 md:px-6 md:py-20 lg:px-10">
          <nav
            aria-label="Breadcrumb"
            className={`${inter.className} mb-6 flex flex-wrap items-center gap-1.5 text-xs uppercase tracking-[0.12em] text-white/40`}
          >
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-white/80">About</span>
          </nav>

          <p
            className={`${inter.className} text-xs font-semibold uppercase tracking-[0.2em] text-[#e85d2a]`}
          >
            Company
          </p>
          <h1
            className={`${anton.className} mt-3 text-4xl uppercase leading-[0.95] tracking-wide text-white md:text-6xl`}
          >
            Built for
            <br />
            the drop
          </h1>
          <p
            className={`${inter.className} mt-5 max-w-xl text-sm leading-relaxed text-white/65 md:text-base`}
          >
            DROPX is a sneaker destination for limited releases and street
            culture — a demo storefront built to show a full modern shopping
            experience from browse to checkout.
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[900px] px-4 py-10 md:px-6 md:py-14 lg:px-10">
        <section>
          <h2
            className={`${anton.className} text-2xl uppercase tracking-wide text-[#121212] md:text-3xl`}
          >
            Our story
          </h2>
          <p
            className={`${inter.className} mt-4 text-sm leading-relaxed text-[#555555] md:text-base`}
          >
            Every week a new pair hits, sells out, and becomes folklore. DROPX
            exists for that moment — clean browsing, real stock by size, wishlist
            saves, and a checkout flow that feels ready for launch day. This
            project is a portfolio mock, but the product experience is built like
            a real store: Next.js, Prisma, auth, cart, orders, and member promos.
          </p>
        </section>

        <div className="mt-12 grid gap-6 border-t border-black/10 pt-10 md:grid-cols-3">
          {pillars.map((pillar, index) => (
            <div key={pillar.title}>
              <p
                className={`${inter.className} text-xs font-semibold uppercase tracking-[0.16em] text-[#e85d2a]`}
              >
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3
                className={`${anton.className} mt-2 text-xl uppercase tracking-wide text-[#121212]`}
              >
                {pillar.title}
              </h3>
              <p
                className={`${inter.className} mt-2 text-sm leading-relaxed text-[#666666]`}
              >
                {pillar.body}
              </p>
            </div>
          ))}
        </div>

        <section className="mt-12 border-t border-black/10 pt-10">
          <h2
            className={`${anton.className} text-2xl uppercase tracking-wide text-[#121212] md:text-3xl`}
          >
            What you can do here
          </h2>
          <ul
            className={`${inter.className} mt-4 space-y-2.5 text-sm leading-relaxed text-[#555555] md:text-base`}
          >
            <li>Browse drops by brand, gender, size, color, and collection.</li>
            <li>Save favorites, build a cart, and place mock orders.</li>
            <li>Subscribe to the newsletter and unlock MEMBER10 in your account.</li>
            <li>
              Read how we handle data in our{" "}
              <Link
                href="/privacy"
                className="font-medium text-[#e85d2a] underline underline-offset-2 transition-opacity hover:opacity-80"
              >
                privacy policy
              </Link>
              .
            </li>
          </ul>
        </section>

        <div className="mt-12 flex flex-col gap-3 border border-black/10 bg-[#f4f4f2] p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
          <div>
            <p
              className={`${inter.className} text-sm font-semibold text-[#121212]`}
            >
              Ready to dig in?
            </p>
            <p
              className={`${inter.className} mt-1 text-sm text-[#666666]`}
            >
              Shop the catalogue or jump on the drop list.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/browse-all"
              className={`${inter.className} inline-flex h-11 items-center justify-center bg-[#e85d2a] px-6 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#f06d3a]`}
            >
              Shop all
            </Link>
            <Link
              href="/#newsletter"
              className={`${inter.className} inline-flex h-11 items-center justify-center border border-black/15 bg-white px-6 text-sm font-semibold uppercase tracking-[0.12em] text-[#121212] transition-colors hover:border-black/30`}
            >
              Join drop list
            </Link>
          </div>
        </div>

        <p
          className={`${inter.className} mt-8 text-sm text-[#888888]`}
        >
          Contact:{" "}
          <a
            href="mailto:hello@dropx.store"
            className="font-medium text-[#e85d2a] underline underline-offset-2 transition-opacity hover:opacity-80"
          >
            hello@dropx.store
          </a>
        </p>
      </div>
    </div>
  );
}
