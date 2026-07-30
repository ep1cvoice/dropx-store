import Link from "next/link";

import { anton, inter } from "@/lib/fonts";

const sections = [
  {
    title: "Who we are",
    body: "DROPX is a sneaker storefront focused on limited drops and exclusive releases. This mock demo store processes account, order, and newsletter data so you can explore the full shopping experience.",
  },
  {
    title: "What we collect",
    body: "Depending on how you use DROPX, we may process: name and email for your account; shipping and contact details at checkout; cart, wishlist, and order history; newsletter subscription email; and cookie preferences you choose in the consent banner.",
  },
  {
    title: "How we use it",
    body: "We use this information to run your account, fulfill (mock) orders, apply member promos like MEMBER10, send drop-list updates you subscribe to, and remember cookie choices. We do not sell personal data.",
  },
  {
    title: "Cookies",
    body: "Essential cookies keep you signed in and store checkout or promo state. Preference cookies remember your consent choice. You can accept or reject non-essential cookies via the banner shown on first visit.",
  },
  {
    title: "How long we keep it",
    body: "Account and order records stay while your account is active. Newsletter emails remain until you ask to be removed. Cookie consent is stored locally in your browser until you clear site data.",
  },
  {
    title: "Your choices",
    body: "You can update account details after signing in, unsubscribe by contacting us, clear cookies in your browser, or reject non-essential cookies from the consent banner. For demo questions, reach hello@dropx.store.",
  },
] as const;

export default function Privacy() {
  return (
    <div className="min-h-[70vh] bg-white">
      <div className="mx-auto w-full max-w-[900px] px-4 py-8 md:px-6 md:py-12 lg:px-10">
        <nav
          aria-label="Breadcrumb"
          className={`${inter.className} mb-6 flex flex-wrap items-center gap-1.5 text-xs uppercase tracking-[0.12em] text-[#999999]`}
        >
          <Link href="/" className="transition-colors hover:text-[#121212]">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#121212]">Privacy Policy</span>
        </nav>

        <p
          className={`${inter.className} text-xs font-semibold uppercase tracking-[0.2em] text-[#e85d2a]`}
        >
          Legal
        </p>
        <h1
          className={`${anton.className} mt-2 text-4xl uppercase tracking-wide text-[#121212] md:text-5xl`}
        >
          Privacy Policy
        </h1>
        <p className={`${inter.className} mt-3 text-sm text-[#888888]`}>
          Last updated: July 30, 2026
        </p>
        <p
          className={`${inter.className} mt-5 max-w-2xl text-sm leading-relaxed text-[#555555] md:text-base`}
        >
          Short version: we only collect what this demo needs to shop, drop-list
          subscribe, and remember your preferences — and we keep it straightforward.
        </p>

        <div className="mt-10 space-y-8 border-t border-black/10 pt-10">
          {sections.map((section, index) => (
            <section key={section.title}>
              <h2
                className={`${anton.className} text-xl uppercase tracking-wide text-[#121212] md:text-2xl`}
              >
                <span className="mr-2 text-[#e85d2a]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {section.title}
              </h2>
              <p
                className={`${inter.className} mt-3 text-sm leading-relaxed text-[#555555] md:text-base`}
              >
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-12 border border-black/10 bg-[#f4f4f2] p-5 md:p-6">
          <p
            className={`${inter.className} text-sm font-semibold text-[#121212]`}
          >
            Questions?
          </p>
          <p
            className={`${inter.className} mt-1.5 text-sm leading-relaxed text-[#666666]`}
          >
            Email{" "}
            <a
              href="mailto:hello@dropx.store"
              className="font-medium text-[#e85d2a] underline underline-offset-2 transition-opacity hover:opacity-80"
            >
              hello@dropx.store
            </a>{" "}
            or head back to the{" "}
            <Link
              href="/"
              className="font-medium text-[#e85d2a] underline underline-offset-2 transition-opacity hover:opacity-80"
            >
              store
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
