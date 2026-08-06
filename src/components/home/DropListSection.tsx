import Badge from "@/components/ui/Badge";
import NewsletterSubscribeForm from "@/components/home/NewsletterSubscribeForm";
import ScrollToNewsletterHash from "@/components/home/ScrollToNewsletterHash";
import { auth } from "@/auth/auth";
import { anton, inter } from "@/lib/fonts";

/** Full visible viewport — uses --app-vh from HeroViewportSync on the homepage. */
const NEWSLETTER_HEIGHT =
  "min-h-[var(--app-vh,100svh)] h-[var(--app-vh,100svh)]";

export default async function DropListSection() {
  const session = await auth();
  const defaultEmail = session?.user?.email?.trim() ?? "";

  return (
    <section
      id="newsletter"
      className={`${NEWSLETTER_HEIGHT} scroll-mt-[var(--site-header-height,7rem)] flex flex-col justify-center bg-[#121212] px-6`}
    >
      <ScrollToNewsletterHash />
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <p
          className={`${inter.className} text-xs font-medium uppercase tracking-[0.25em] text-[#e85d2a] md:text-sm`}
        >
          Never miss a drop
        </p>

        <h2
          className={`${anton.className} mt-4 text-[40px] uppercase leading-[0.95] tracking-wide text-white sm:text-5xl md:mt-6 md:text-6xl lg:text-7xl xl:text-[80px]`}
        >
          Join the
          <br />
          drop list
        </h2>

        <p
          className={`${inter.className} mt-5 max-w-lg text-sm leading-relaxed text-white/80 md:text-base`}
        >
          Subscribe to our newsletter to be the first to know about new drops,
          restocks, and member-only deals.
        </p>

        <p
          className={`${inter.className} mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-white/80 md:text-base`}
        >
          <span>As a subscriber, you&apos;ll get a</span>
          <Badge variant="discount" discountValue={10} />
          <span>discount with a minimum purchase of €400 via coupon code.</span>
        </p>

        <NewsletterSubscribeForm defaultEmail={defaultEmail} />
      </div>
    </section>
  );
}
