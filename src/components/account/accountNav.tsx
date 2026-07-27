import {
  CreditCard,
  Heart,
  MapPin,
  Settings,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";

export type AccountNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const ACCOUNT_NAV: AccountNavItem[] = [
  { href: "/account/orders", label: "My Orders", icon: ShoppingBag },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  {
    href: "/account/payment-methods",
    label: "Payment Methods",
    icon: CreditCard,
  },
  { href: "/account/settings", label: "Settings", icon: Settings },
];
