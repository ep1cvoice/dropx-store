import {
  CreditCard,
  Heart,
  Settings,
  ShoppingBag,
  TicketPercent,
  User,
  type LucideIcon,
} from "lucide-react";

export type AccountNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const ACCOUNT_NAV: AccountNavItem[] = [
  { href: "/account/profile-data", label: "Profile Data", icon: User },
  { href: "/account/orders", label: "My Orders", icon: ShoppingBag },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/discount-codes", label: "Discount Codes", icon: TicketPercent },
  {
    href: "/account/payment-methods",
    label: "Payment Methods",
    icon: CreditCard,
  },
];
