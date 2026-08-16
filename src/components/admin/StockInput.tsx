"use client";

import { useEffect, useState, useTransition } from "react";

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
  const [value, setValue] = useState(String(initialStock));
  const [saved, setSaved] = useState(initialStock);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setValue(String(initialStock));
    setSaved(initialStock);
  }, [initialStock]);

  function commit(nextRaw: string | number) {
    const stock =
      typeof nextRaw === "number"
        ? nextRaw
        : Number.parseInt(nextRaw, 10);

    if (!Number.isInteger(stock) || stock < 0) {
      setError("Invalid stock");
      setValue(String(saved));
      return;
    }

    setValue(String(stock));
    if (stock === saved) {
      setError(null);
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        const result = await updateSizeStock(sizeId, stock);
        if (!result.ok) {
          setError(result.error);
          setValue(String(saved));
          return;
        }
        setSaved(stock);
      } catch (e) {
        const message =
          e instanceof Error && e.message
            ? e.message
            : "Failed to save stock";
        setError(message);
        setValue(String(saved));
      }
    });
  }

  function bump(delta: number) {
    const current = Number.parseInt(value, 10);
    const base = Number.isInteger(current) && current >= 0 ? current : saved;
    commit(Math.max(0, base + delta));
  }

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1.5">
        <span className={`${inter.className} w-10 shrink-0 text-xs text-[#666666]`}>
          {sizeLabel}
        </span>
        <button
          type="button"
          disabled={pending}
          onClick={() => bump(-1)}
          className={`${inter.className} flex h-7 w-7 cursor-pointer items-center justify-center border border-black/15 bg-white text-sm hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50`}
          aria-label={`Decrease stock for ${sizeLabel}`}
        >
          −
        </button>
        <input
          type="number"
          min={0}
          step={1}
          value={value}
          disabled={pending}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => commit(value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit(value);
            }
          }}
          className={`${inter.className} w-14 rounded-none border border-black/15 bg-white px-1.5 py-1 text-center text-sm outline-none focus:border-[#e85d2a] disabled:opacity-50`}
          aria-label={`Stock for ${sizeLabel}`}
        />
        <button
          type="button"
          disabled={pending}
          onClick={() => bump(1)}
          className={`${inter.className} flex h-7 w-7 cursor-pointer items-center justify-center border border-black/15 bg-white text-sm hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50`}
          aria-label={`Increase stock for ${sizeLabel}`}
        >
          +
        </button>
      </div>
      {error && (
        <p className={`${inter.className} max-w-[14rem] text-[10px] leading-snug text-red-600`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
