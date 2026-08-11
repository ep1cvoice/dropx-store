import { Star } from "lucide-react";

import { inter } from "@/lib/fonts";

type StarRatingProps = {
  value: number;
  size?: number;
  className?: string;
  /** Accessible label; defaults to "Rated X out of 5". */
  label?: string;
};

/** Read-only star row (supports half-stars via rounded average). */
export default function StarRating({
  value,
  size = 16,
  className = "",
  label,
}: StarRatingProps) {
  const clamped = Math.max(0, Math.min(5, value));
  const aria =
    label ??
    (clamped > 0
      ? `Rated ${clamped.toFixed(1)} out of 5`
      : "No ratings yet");

  return (
    <div
      className={`inline-flex items-center gap-0.5 ${className}`}
      role="img"
      aria-label={aria}
    >
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.min(1, Math.max(0, clamped - i));
        const pct = Math.round(fill * 100);
        return (
          <span key={i} className="relative inline-flex" aria-hidden>
            <Star
              size={size}
              strokeWidth={1.5}
              className="text-[#cccccc]"
              fill="none"
            />
            {pct > 0 && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${pct}%` }}
              >
                <Star
                  size={size}
                  strokeWidth={1.5}
                  className="text-[#e85d2a]"
                  fill="currentColor"
                />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

type InteractiveStarRatingProps = {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
};

/** Clickable 1–5 stars for the review form. */
export function InteractiveStarRating({
  value,
  onChange,
  disabled = false,
}: InteractiveStarRatingProps) {
  return (
    <div
      className="inline-flex items-center gap-1"
      role="radiogroup"
      aria-label="Your rating"
    >
      {Array.from({ length: 5 }, (_, i) => {
        const rating = i + 1;
        const active = rating <= value;
        return (
          <button
            key={rating}
            type="button"
            role="radio"
            aria-checked={value === rating}
            aria-label={`${rating} star${rating === 1 ? "" : "s"}`}
            disabled={disabled}
            onClick={() => onChange(rating)}
            className={`${inter.className} cursor-pointer rounded-none p-0.5 transition-colors disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 ${
              active ? "text-[#e85d2a]" : "text-[#cccccc] hover:text-[#e85d2a]/70"
            }`}
          >
            <Star
              size={22}
              strokeWidth={1.5}
              fill={active ? "currentColor" : "none"}
            />
          </button>
        );
      })}
    </div>
  );
}
