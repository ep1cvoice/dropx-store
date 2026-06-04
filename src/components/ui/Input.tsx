import { inter } from "@/lib/fonts";

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
  ...props
}: InputProps) {
  return (
    <div className={wrapperClassName}>
      <label
        htmlFor={id}
        className={`${inter.className} mb-2 block text-sm text-gray-500`}
      >
        {label}
      </label>
      <input
        id={id}
        className={`${inter.className} w-full rounded-md border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400 disabled:cursor-not-allowed disabled:opacity-50 ${
          error ? "border-red-400 focus:border-red-400" : "border-gray-200"
        } ${className}`}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
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
