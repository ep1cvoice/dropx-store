"use client";

import { Minus, Plus } from "lucide-react";
import { inter } from "@/lib/fonts";

export type QuantitySelectorProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
}: QuantitySelectorProps) {
  const decrement = () => {
    if (value > min) onChange(value - 1);
  };

  const increment = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div
      className="inline-flex items-center overflow-hidden rounded-none border border-gray-200"
      role="group"
      aria-label="Quantity"
    >
      <button
        type="button"
        onClick={decrement}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className="flex h-11 w-11 items-center justify-center cursor-pointer text-gray-500 transition-colors hover:bg-gray-50 hover:text-[#121212] disabled:pointer-events-none disabled:text-gray-300"
      >
        <Minus size={14} />
      </button>

      <span
        className={`${inter.className} flex h-11 w-11 items-center justify-center border-x border-gray-200 text-sm font-medium text-[#121212] select-none`}
        aria-live="polite"
        aria-atomic="true"
      >
        {value}
      </span>

      <button
        type="button"
        onClick={increment}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="flex h-11 w-11 items-center justify-center cursor-pointer text-gray-500 transition-colors hover:bg-gray-50 hover:text-[#121212] disabled:pointer-events-none disabled:text-gray-300"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
