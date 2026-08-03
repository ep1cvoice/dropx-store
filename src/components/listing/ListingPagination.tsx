"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { inter } from "@/lib/fonts";
import { useListingNav } from "./ListingNav";

type ListingPaginationProps = {
  page: number;
  totalPages: number;
};

export default function ListingPagination({
  page,
  totalPages,
}: ListingPaginationProps) {
  const { navigate } = useListingNav();

  if (totalPages <= 1) {
    return null;
  }

  const goTo = (target: number) =>
    navigate({ page: target === 1 ? null : String(target) });

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const baseItem =
    "flex h-9 min-w-9 items-center justify-center rounded-none border px-3 text-sm transition-colors";

  return (
    <nav
      aria-label="Pagination"
      className={`${inter.className} mt-12 flex items-center justify-center gap-2`}
    >
      {page > 1 ? (
        <button
          type="button"
          onClick={() => goTo(page - 1)}
          aria-label="Previous page"
          className={`${baseItem} cursor-pointer border-gray-200 text-[#121212] hover:border-gray-400`}
        >
          <ChevronLeft size={16} />
        </button>
      ) : (
        <span
          aria-hidden="true"
          className={`${baseItem} border-gray-100 text-gray-300`}
        >
          <ChevronLeft size={16} />
        </span>
      )}

      {pages.map((p) => {
        const active = p === page;
        return (
          <button
            key={p}
            type="button"
            onClick={() => goTo(p)}
            aria-current={active ? "page" : undefined}
            className={`${baseItem} cursor-pointer ${
              active
                ? "border-[#121212] bg-[#121212] font-semibold text-white"
                : "border-gray-200 text-[#121212] hover:border-gray-400"
            }`}
          >
            {p}
          </button>
        );
      })}

      {page < totalPages ? (
        <button
          type="button"
          onClick={() => goTo(page + 1)}
          aria-label="Next page"
          className={`${baseItem} cursor-pointer border-gray-200 text-[#121212] hover:border-gray-400`}
        >
          <ChevronRight size={16} />
        </button>
      ) : (
        <span
          aria-hidden="true"
          className={`${baseItem} border-gray-100 text-gray-300`}
        >
          <ChevronRight size={16} />
        </span>
      )}
    </nav>
  );
}
