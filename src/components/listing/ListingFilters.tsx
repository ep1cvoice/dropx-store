"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import SizeButton from "@/components/ui/SizeButton";
import { inter } from "@/lib/fonts";
import {
  COLLECTIONS,
  COLOR_FILTERS,
  PRICE_BOUNDS,
  SIZE_FILTERS,
  type BrandFacet,
} from "@/lib/listing";
import { buildHref, parseCsv, toggleCsv } from "./params";

type ListingFiltersProps = {
  brandFacets: BrandFacet[];
  showCollections: boolean;
  showBrands?: boolean;
};

const LABEL_CLASS =
  "text-[11px] font-semibold uppercase tracking-[0.16em] text-[#121212]";

export default function ListingFilters({
  brandFacets,
  showCollections,
  showBrands = true,
}: ListingFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const collection = searchParams.get("collection") ?? "browse-all";
  const brands = parseCsv(searchParams.get("brand"));
  const activeSizes = parseCsv(searchParams.get("size"));
  const colors = parseCsv(searchParams.get("color"));
  const minParam = searchParams.get("min");
  const maxParam = searchParams.get("max");

  const [minPrice, setMinPrice] = useState(minParam ?? "");
  const [maxPrice, setMaxPrice] = useState(maxParam ?? "");

  // Keep local price inputs in sync when the URL changes (e.g. Clear All).
  useEffect(() => {
    setMinPrice(minParam ?? "");
    setMaxPrice(maxParam ?? "");
  }, [minParam, maxParam]);

  const hasActiveFilters =
    brands.length > 0 ||
    activeSizes.length > 0 ||
    colors.length > 0 ||
    minParam != null ||
    maxParam != null;

  function navigate(updates: Record<string, string | null>) {
    // Any filter change resets pagination.
    router.push(buildHref(pathname, searchParams, { page: null, ...updates }), {
      scroll: false,
    });
  }

  function applyPrice() {
    navigate({
      min: minPrice.trim() === "" ? null : minPrice.trim(),
      max: maxPrice.trim() === "" ? null : maxPrice.trim(),
    });
  }

  function clearAll() {
    // Preserve the current collection, drop every other filter.
    const keep = showCollections && collection !== "browse-all" ? collection : null;
    router.push(buildHref(pathname, new URLSearchParams(), { collection: keep }), {
      scroll: false,
    });
  }

  return (
    <aside className={`${inter.className} w-full`}>
      {showCollections && (
        <FilterGroup title="Collection">
          <div className="flex flex-col gap-2">
            {COLLECTIONS.map((c) => {
              const active = collection === c.slug;
              return (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() =>
                    navigate({ collection: c.slug === "browse-all" ? null : c.slug })
                  }
                  className={`flex items-center gap-2 text-left text-sm transition-colors ${
                    active ? "font-semibold text-[#121212]" : "text-[#666666] hover:text-[#121212]"
                  }`}
                >
                  <span
                    className={`h-3 w-3 rounded-none border ${
                      active ? "border-[#e85d2a] bg-[#e85d2a]" : "border-gray-300"
                    }`}
                  />
                  {c.label}
                </button>
              );
            })}
          </div>
        </FilterGroup>
      )}

      {showBrands && (
      <FilterGroup title="Brand">
        <div className="flex flex-col gap-2.5">
          {brandFacets.map((brand) => {
            const checked = brands.includes(brand.slug);
            return (
              <label
                key={brand.slug}
                className="flex cursor-pointer items-center gap-2.5 text-sm text-[#333333]"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    navigate({ brand: toggleCsv(searchParams.get("brand"), brand.slug) })
                  }
                  className="h-4 w-4 shrink-0 accent-[#e85d2a]"
                />
                <span className="flex-1">{brand.name}</span>
                <span className="text-xs text-[#999999]">{brand.count}</span>
              </label>
            );
          })}
        </div>
      </FilterGroup>
      )}

      <FilterGroup title="Size (EU)">
        <div className="flex flex-wrap gap-2">
          {SIZE_FILTERS.map((size) => (
            <SizeButton
              key={size}
              size={size}
              available
              selected={activeSizes.includes(size)}
              onClick={() =>
                navigate({ size: toggleCsv(searchParams.get("size"), size) })
              }
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Price range">
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={PRICE_BOUNDS.min}
            max={PRICE_BOUNDS.max}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onBlur={applyPrice}
            onKeyDown={(e) => e.key === "Enter" && applyPrice()}
            placeholder={`€${PRICE_BOUNDS.min}`}
            aria-label="Minimum price"
            className="w-full rounded-none border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
          />
          <span className="text-gray-400">—</span>
          <input
            type="number"
            inputMode="numeric"
            min={PRICE_BOUNDS.min}
            max={PRICE_BOUNDS.max}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onBlur={applyPrice}
            onKeyDown={(e) => e.key === "Enter" && applyPrice()}
            placeholder={`€${PRICE_BOUNDS.max}`}
            aria-label="Maximum price"
            className="w-full rounded-none border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
          />
        </div>
      </FilterGroup>

      <FilterGroup title="Color">
        <div className="flex flex-wrap gap-3">
          {COLOR_FILTERS.map((color) => {
            const active = colors.includes(color.family);
            return (
              <button
                key={color.family}
                type="button"
                onClick={() =>
                  navigate({ color: toggleCsv(searchParams.get("color"), color.family) })
                }
                aria-label={color.label}
                aria-pressed={active}
                title={color.label}
                className={`h-7 w-7 rounded-none border border-black/15 transition-transform hover:scale-110 ${
                  active ? "ring-2 ring-[#121212] ring-offset-2" : ""
                }`}
                style={{ backgroundColor: color.hex }}
              />
            );
          })}
        </div>
      </FilterGroup>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#e85d2a] transition-opacity hover:opacity-70"
        >
          Clear all filters
        </button>
      )}
    </aside>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-black/10 py-5 first:pt-0">
      <h3 className={`${LABEL_CLASS} mb-3`}>{title}</h3>
      {children}
    </div>
  );
}
