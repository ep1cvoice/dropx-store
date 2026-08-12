"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { updateSizeStock } from "@/actions/admin/products";
import { inter } from "@/lib/fonts";

type StockInputProps = {
  sizeId: string;
  initialStock: number;
  sizeLabel: string;
};

export default function StockInput({
  sizeId,
  initialStock,
  sizeLabel,
}: StockInputProps) {
  const router = useRouter();
  const [value, setValue] = useState(String(initialStock));
  const [pending, startTransition] = useTransition();

  function save() {
    const stock = Number.parseInt(value, 10);
    if (!Number.isInteger(stock) || stock < 0) return;

    startTransition(async () => {
      await updateSizeStock(sizeId, stock);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`${inter.className} w-14 shrink-0 text-xs text-[#666666]`}>
        {sizeLabel}
      </span>
      <input
        type="number"
        min={0}
        step={1}
        value={value}
        disabled={pending}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            save();
          }
        }}
        className={`${inter.className} w-16 rounded-none border border-black/15 bg-white px-2 py-1 text-sm outline-none focus:border-[#e85d2a] disabled:opacity-50`}
        aria-label={`Stock for ${sizeLabel}`}
      />
    </div>
  );
}
