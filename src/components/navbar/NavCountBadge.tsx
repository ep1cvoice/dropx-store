"use client";

import { inter } from "@/lib/fonts";

type NavCountBadgeProps = {
  count: number;
};

/** Orange pill overlaid on a navbar icon when count > 0. */
export default function NavCountBadge({ count }: NavCountBadgeProps) {
  if (count <= 0) return null;

  const label = count > 99 ? "99+" : String(count);

  return (
    <span
      className={`${inter.className} absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-none bg-[#e85d2a] px-1 text-[10px] font-bold leading-none text-white`}
    >
      {label}
    </span>
  );
}
