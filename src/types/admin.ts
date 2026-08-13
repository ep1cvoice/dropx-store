export type UserRole = "CUSTOMER" | "ADMIN";

export const USER_ROLES = ["CUSTOMER", "ADMIN"] as const satisfies readonly UserRole[];

export const PRODUCT_CATEGORIES = [
  "running",
  "basketball",
  "lifestyle",
  "skateboarding",
] as const;

export const PRODUCT_GENDERS = ["men", "women", "unisex"] as const;

export const PRODUCT_BADGES = ["new", "limited", "discount", "soldOut"] as const;

export type AdminProductCategory = (typeof PRODUCT_CATEGORIES)[number];
export type AdminProductGender = (typeof PRODUCT_GENDERS)[number];
export type AdminProductBadge = (typeof PRODUCT_BADGES)[number];
