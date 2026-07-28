import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { getBrands } from "@/lib/catalog";
import { anton, inter } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Brands — DROPX",
  description: "Shop sneakers by brand at DROPX.",
};

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1600px] px-4 py-8 md:px-6 md:py-10 lg:px-10">
        <nav
          aria-label="Breadcrumb"
          className={`${inter.className} mb-5 flex flex-wrap items-center gap-1.5 text-xs uppercase tracking-[0.12em] text-[#999999]`}
        >
          <Link href="/" className="transition-colors hover:text-[#121212]">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#121212]">Brands</span>
        </nav>

        <h1
          className={`${anton.className} text-4xl uppercase leading-[0.9] tracking-wide text-[#121212] md:text-5xl`}
        >
          Brands
        </h1>
        <p className={`${inter.className} mt-2 text-sm text-[#666666]`}>
          {brands.length} brands
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/browse-all?brand=${brand.slug}`}
              className="group flex flex-col overflow-hidden rounded-none bg-white ring-1 ring-black/5 transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#f5f5f5]">
                {brand.imageUrl ? (
                  <Image
                    src={brand.imageUrl}
                    alt={brand.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span
                      className={`${anton.className} text-2xl uppercase tracking-wide text-[#c4c4c4]`}
                    >
                      {brand.name}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span
                  className={`${anton.className} text-lg uppercase tracking-wide text-[#121212]`}
                >
                  {brand.name}
                </span>
                <span className={`${inter.className} text-xs text-[#999999]`}>
                  {brand.productCount}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
