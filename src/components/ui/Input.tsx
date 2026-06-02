import { inter } from "@/lib/fonts";

export type InputProps = {
  label: string;
  id: string;
  wrapperClassName?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "id">;

export default function Input({
  label,
  id,
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
        className={`${inter.className} w-full rounded-md border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
    </div>
  );
}
