import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ScrollToNewsletterHash from "@/components/home/ScrollToNewsletterHash";
import { anton, inter } from "@/lib/fonts";

export default function DropListSection() {
  return (
    <section
      id="newsletter"
      className="scroll-mt-28 bg-[#121212] px-6 py-16 md:scroll-mt-32 md:py-24 lg:py-28"
    >
      <ScrollToNewsletterHash />
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
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

        <form className="mt-8 w-full max-w-xl sm:mt-10" action="#" noValidate>
          <div className="flex flex-col gap-4 sm:flex-row md:gap-0">
            <label htmlFor="drop-list-email" className="sr-only">
              Email address
            </label>
            <input
              id="drop-list-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              className={`${inter.className} w-full flex-1 rounded-none border border-transparent bg-[#222222] px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/20 sm:py-4 sm:text-base`}
            />
            <Button
              type="submit"
              variant="accent"
              className="w-full shrink-0 cursor-pointer rounded-none px-8 py-3.5 text-sm uppercase tracking-wide sm:w-auto sm:py-4"
            >
              Subscribe
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
