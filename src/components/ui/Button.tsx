import { inter } from "@/lib/fonts";

const variantStyles = {
  normal:
    "bg-[#222222] font-semibold text-white hover:bg-[#2a2a2a] active:bg-[#1a1a1a]",
  accent:
    "bg-[#e85d2a] font-semibold text-white hover:bg-[#f06d3a] active:bg-[#d45220]",
  secondary:
    "border border-white/15 bg-transparent font-normal text-white/40 hover:border-white/25 hover:text-white/55 active:text-white/50",
  outline:
    "border border-gray-200 bg-white font-medium text-gray-900 hover:border-gray-300 hover:bg-gray-50 active:bg-gray-100",
} as const;

export type ButtonVariant = keyof typeof variantStyles;

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export default function Button({
  variant = "normal",
  className = "",
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${inter.className} inline-flex items-center justify-center gap-2 rounded-none px-6 py-2.5 text-sm transition-colors disabled:pointer-events-none disabled:opacity-50 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
