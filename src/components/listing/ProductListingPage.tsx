import Link from "next/link";

import ProductCard from "@/components/product/ProductCard";
import ListingFilters from "@/components/listing/ListingFilters";
import {
  ListingNavProvider,
  ListingPendingFrame,
} from "@/components/listing/ListingNav";
import ListingPagination from "@/components/listing/ListingPagination";
import ListingSort from "@/components/listing/ListingSort";
import { parseCsv } from "@/components/listing/params";
import { getProductListing } from "@/lib/catalog";
import { anton, inter } from "@/lib/fonts";
import {
  isCollectionSlug,
  isGenderFilter,
  isProductCategory,
  isSortOption,
  type CollectionSlug,
  type GenderFilter,
  type SortOption,
} from "@/lib/listing";
import type { ProductCategory } from "@/types/product";

type SearchParams = Record<string, string | string[] | undefined>;

type ProductListingPageProps = {
  title: string;
  searchParams: SearchParams;
  /** When set, the collection is fixed and the sidebar hides the collection group. */
  lockedCollection?: CollectionSlug;
  /** When set, results are fixed to this brand and the sidebar hides the brand group. */
  lockedBrandSlug?: string;
  /** When set, results are fixed to this gender (plus unisex) and the sidebar hides gender. */
  lockedGender?: GenderFilter;
};

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function toInt(value: string | undefined): number | undefined {
  if (value == null || value.trim() === "") return undefined;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : undefined;
}

export default async function ProductListingPage({
  title,
  searchParams,
  lockedCollection,
  lockedBrandSlug,
  lockedGender,
}: ProductListingPageProps) {
  const collectionParam = first(searchParams.collection);
  const collection: CollectionSlug =
    lockedCollection ??
    (isCollectionSlug(collectionParam) ? collectionParam : "browse-all");

  const sortParam = first(searchParams.sort);
  const sort: SortOption = isSortOption(sortParam) ? sortParam : "newest";

  const genderParam = first(searchParams.gender);
  const gender: GenderFilter | undefined =
    lockedGender ??
    (isGenderFilter(genderParam) ? genderParam : undefined);

  const categoryParam = first(searchParams.category);
  const category: ProductCategory | undefined = isProductCategory(categoryParam)
    ? categoryParam
    : undefined;

  const brands = lockedBrandSlug
    ? [lockedBrandSlug]
    : parseCsv(first(searchParams.brand));

  const { products, total, page, totalPages, brandFacets } =
    await getProductListing({
      collection,
      gender,
      category,
      brands,
      sizes: parseCsv(first(searchParams.size)),
      colors: parseCsv(first(searchParams.color)),
      priceMin: toInt(first(searchParams.min)),
      priceMax: toInt(first(searchParams.max)),
      includeOutOfStock: first(searchParams.oos) === "1",
      sort,
      page: toInt(first(searchParams.page)) ?? 1,
    });

  return (
    <ListingNavProvider>
      <div className="bg-white">
        <div className="mx-auto max-w-[1600px] px-4 py-8 md:px-6 md:py-10 lg:px-10">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className={`${inter.className} mb-5 flex flex-wrap items-center gap-1.5 text-xs uppercase tracking-[0.12em] text-[#999999]`}
          >
            <Link href="/" className="transition-colors hover:text-[#121212]">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#121212]">{title}</span>
          </nav>

          {/* Header */}
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1
                className={`${anton.className} text-4xl uppercase leading-[0.9] tracking-wide text-[#121212] md:text-5xl`}
              >
                {title}
              </h1>
              <p className={`${inter.className} mt-2 text-sm text-[#666666]`}>
                {total} {total === 1 ? "product" : "products"}
              </p>
            </div>
            <ListingSort />
          </div>

          <div className="flex flex-col gap-8 min-[1200px]:flex-row min-[1200px]:gap-10">
            {/* Filters: collapsed behind a button below 1200px, sidebar from 1200px up */}
            <div className="min-[1200px]:w-60 min-[1200px]:shrink-0">
              <ListingFilters
                brandFacets={brandFacets}
                showCollections={!lockedCollection}
                showBrands={!lockedBrandSlug}
                showGender={!lockedGender}
              />
            </div>

            <div className="min-w-0 flex-1">
              <ListingPendingFrame>
                {products.length === 0 ? (
                  <div
                    className={`${inter.className} flex min-h-[40vh] items-center justify-center rounded-none border border-dashed border-gray-200 text-center text-sm text-[#666666]`}
                  >
                    No products match your filters. Try clearing some.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 min-[1200px]:grid-cols-3">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}

                <ListingPagination page={page} totalPages={totalPages} />
              </ListingPendingFrame>
            </div>
          </div>
        </div>
      </div>
    </ListingNavProvider>
  );
}
