import Button from "@/components/ui/Button";
import { anton, inter } from "@/lib/fonts";

export default function DropListSection() {
  return (
    <section className="bg-[#121212] px-6 py-16 md:py-24 lg:py-28">
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
          className={`${inter.className} mt-5 max-w-md text-sm leading-relaxed text-white/50 md:mt-6 md:max-w-lg md:text-base`}
        >
          Get early access to exclusive drops, restocks, and member-only deals.
          Be the first to know.
        </p>

        <form
          className="mt-8 w-full max-w-xl sm:mt-10"
          action="#"
          noValidate
        >
          <div className="flex flex-col sm:flex-row gap-4 md:gap-0">
            <label htmlFor="drop-list-email" className="sr-only">
              Email address
            </label>
            <input
              id="drop-list-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              className={`${inter.className} w-full flex-1 border border-transparent bg-[#222222] px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/20 sm:rounded-none sm:rounded-l-md sm:py-4 sm:text-base`}
            />
            <Button
              type="submit"
              variant="accent"
              className="w-full shrink-0 cursor-pointer rounded-md px-8 py-3.5 text-sm uppercase tracking-wide sm:w-auto sm:rounded-none sm:rounded-r-md sm:py-4"
            >
              Subscribe
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
