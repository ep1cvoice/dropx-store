import { inter } from "@/lib/fonts";

export type SizeButtonProps = {
  size: string;
  available: boolean;
  selected?: boolean;
  onClick?: () => void;
};

export default function SizeButton({
  size,
  available,
  selected = false,
  onClick,
}: SizeButtonProps) {
  return (
    <button
      type="button"
      disabled={!available}
      onClick={available ? onClick : undefined}
      aria-label={`Size ${size}${!available ? ", unavailable" : ""}`}
      aria-pressed={selected}
      className={`
        ${inter.className}
        relative flex h-11 w-14 items-center justify-center rounded-none
        text-sm font-medium transition-colors
        ${
          !available
            ? "cursor-not-allowed bg-[#e8e8e8] text-gray-400 select-none"
            : selected
              ? "cursor-pointer border-2 border-[#121212] bg-[#121212] text-white"
              : "cursor-pointer border border-gray-200 bg-white text-[#121212] hover:border-gray-400"
        }
      `}
    >
      {size}
      {/* Diagonal strikethrough line for unavailable sizes */}
      {!available && (
        <span
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-none"
          aria-hidden="true"
        >
          <svg
            className="h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <line
              x1="15"
              y1="85"
              x2="85"
              y2="15"
              stroke="#c0c0c0"
              strokeWidth="2"
            />
          </svg>
        </span>
      )}
    </button>
  );
}
