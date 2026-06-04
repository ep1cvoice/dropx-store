import { inter } from "@/lib/fonts";

const variantStyles = {
  new: "bg-[#e85d2a] text-white",
  limited: "bg-[#1a1a1a] text-[#a3e635] border border-[#a3e635]/20",
  discount: "bg-[#e8394a] text-white",
  soldOut: "bg-[#2a2a2a] text-white/80",
} as const;

const variantLabels: Record<BadgeVariant, string> = {
  new: "NEW",
  limited: "LIMITED",
  discount: "",
  soldOut: "SOLD OUT",
};

export type BadgeVariant = keyof typeof variantStyles;

type BaseProps = {
  variant: Exclude<BadgeVariant, "discount">;
  label?: string;
  discountValue?: never;
  className?: string;
};

type DiscountProps = {
  variant: "discount";
  /** Numeric discount percentage provided by the shop/admin, e.g. 20 → "-20%" */
  discountValue: number;
  label?: never;
  className?: string;
};

export type BadgeProps = BaseProps | DiscountProps;

export default function Badge({
  variant,
  label,
  discountValue,
  className = "",
}: BadgeProps) {
  const text =
    variant === "discount"
      ? `-${discountValue}%`
      : (label ?? variantLabels[variant]);

  return (
    <span
      className={`${inter.className} inline-flex items-center justify-center rounded-md px-3 py-1 text-xs font-bold uppercase tracking-wider ${variantStyles[variant]} ${className}`}
    >
      {text}
    </span>
  );
}
