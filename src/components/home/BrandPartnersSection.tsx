import { anton, inter } from "@/lib/fonts";

const brands = ["Nike", "Adidas", "New Balance", "Puma", "Converse"];

export default function BrandPartnersSection() {
  return (
    <section className="bg-white px-4 py-10 md:py-14">
      <div className="mx-auto max-w-[1600px]">
        <p
          className={`${inter.className} mb-8 text-center text-[10px] font-medium uppercase tracking-[0.28em] text-black/30 md:mb-10 md:text-[11px] md:tracking-[0.32em]`}
        >
          Official Brand Partners
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 md:gap-x-16 lg:gap-x-20 xl:gap-x-24">
          {brands.map((brand) => (
            <span
              key={brand}
              className={`${anton.className} cursor-pointer text-[28px] uppercase tracking-[0.06em] text-black/20 transition-colors duration-200 hover:text-black/50 md:text-[36px] lg:text-[42px]`}
            >
              {brand}
            </span>
          ))}
        </div>

        <div className="mt-10 h-px w-full bg-black/10 md:mt-14" />
      </div>
    </section>
  );
}
