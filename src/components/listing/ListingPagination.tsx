"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { inter } from "@/lib/fonts";
import { buildHref } from "./params";

type ListingPaginationProps = {
  page: number;
  totalPages: number;
};

export default function ListingPagination({
  page,
  totalPages,
}: ListingPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) {
    return null;
  }

  const hrefFor = (target: number) =>
    buildHref(pathname, searchParams, {
      page: target === 1 ? null : String(target),
    });

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const baseItem =
    "flex h-9 min-w-9 items-center justify-center rounded-none border px-3 text-sm transition-colors";

  return (
    <nav
      aria-label="Pagination"
      className={`${inter.className} mt-12 flex items-center justify-center gap-2`}
    >
      {page > 1 ? (
        <Link
          href={hrefFor(page - 1)}
          scroll={false}
          aria-label="Previous page"
          className={`${baseItem} border-gray-200 text-[#121212] hover:border-gray-400`}
        >
          <ChevronLeft size={16} />
        </Link>
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
          <Link
            key={p}
            href={hrefFor(p)}
            scroll={false}
            aria-current={active ? "page" : undefined}
            className={`${baseItem} ${
              active
                ? "border-[#121212] bg-[#121212] font-semibold text-white"
                : "border-gray-200 text-[#121212] hover:border-gray-400"
            }`}
          >
            {p}
          </Link>
        );
      })}

      {page < totalPages ? (
        <Link
          href={hrefFor(page + 1)}
          scroll={false}
          aria-label="Next page"
          className={`${baseItem} border-gray-200 text-[#121212] hover:border-gray-400`}
        >
          <ChevronRight size={16} />
        </Link>
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
