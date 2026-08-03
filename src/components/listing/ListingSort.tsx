"use client";

import { useSearchParams } from "next/navigation";

import { inter } from "@/lib/fonts";
import { SORT_OPTIONS } from "@/lib/listing";
import { useListingNav } from "./ListingNav";

export default function ListingSort() {
  const searchParams = useSearchParams();
  const { navigate } = useListingNav();

  const current = searchParams.get("sort") ?? "newest";

  return (
    <label className={`${inter.className} flex items-center gap-2 text-sm text-[#666666]`}>
      <span className="hidden sm:inline">Sort by:</span>
      <select
        value={current}
        onChange={(e) => {
          const value = e.target.value;
          navigate({
            sort: value === "newest" ? null : value,
          });
        }}
        className="cursor-pointer rounded-none border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-[#121212] outline-none focus:border-gray-400"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
