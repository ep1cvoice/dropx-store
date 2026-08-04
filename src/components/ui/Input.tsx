"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { inter } from "@/lib/fonts";

const REVEAL_MS = 3000;

export type InputProps = {
  label: string;
  id: string;
  error?: string;
  wrapperClassName?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "id">;

export default function Input({
  label,
  id,
  error,
  wrapperClassName = "",
  className = "",
  type,
  ...props
}: InputProps) {
  const isPassword = type === "password";
  const [revealed, setRevealed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handleRevealClick() {
    if (revealed) {
      setRevealed(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
      return;
    }

    setRevealed(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setRevealed(false);
      timerRef.current = null;
    }, REVEAL_MS);
  }

  return (
    <div className={wrapperClassName}>
      <label
        htmlFor={id}
        className={`${inter.className} mb-2 block text-sm text-gray-500`}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={isPassword ? (revealed ? "text" : "password") : type}
          className={`${inter.className} w-full rounded-none border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400 disabled:cursor-not-allowed disabled:opacity-50 ${
            isPassword ? "pr-11" : ""
          } ${
            error ? "border-red-400 focus:border-red-400" : "border-gray-200"
          } ${className}`}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={handleRevealClick}
            aria-label={revealed ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 flex -translate-y-1/2 cursor-pointer items-center justify-center text-[#888888] transition-colors hover:text-[#121212]"
          >
            {revealed ? (
              <EyeOff size={18} strokeWidth={1.75} aria-hidden />
            ) : (
              <Eye size={18} strokeWidth={1.75} aria-hidden />
            )}
          </button>
        )}
      </div>
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className={`${inter.className} mt-1.5 text-xs text-red-500`}
        >
          {error}
        </p>
      )}
    </div>
  );
}
