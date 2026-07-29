"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUserId, getCart } from "@/lib/cart";
import {
  clearAppliedPromoCode,
  isCurrentUserPromoEligible,
  setAppliedPromoCode,
} from "@/lib/newsletter";
import {
  MEMBER_PROMO_CODE,
  MEMBER_PROMO_MIN_SUBTOTAL,
  isMemberPromoCode,
  normalizePromoCode,
} from "@/lib/promo";

export type ApplyPromoResult =
  | { ok: true; code: string; message: string }
  | { ok: false; error: string };

export async function applyPromoCode(rawCode: string): Promise<ApplyPromoResult> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return {
      ok: false,
      error: "Sign in to apply a promo code.",
    };
  }

  const code = normalizePromoCode(rawCode);
  if (!code) {
    return { ok: false, error: "Enter a promo code." };
  }

  if (!isMemberPromoCode(code)) {
    return { ok: false, error: "That code isn't valid." };
  }

  const eligible = await isCurrentUserPromoEligible();
  if (!eligible) {
    return {
      ok: false,
      error: `Subscribe to the newsletter with your account email to unlock ${MEMBER_PROMO_CODE}.`,
    };
  }

  const cart = await getCart();
  await setAppliedPromoCode(MEMBER_PROMO_CODE);

  revalidatePath("/cart");
  revalidatePath("/checkout");

  if (cart.subtotal < MEMBER_PROMO_MIN_SUBTOTAL) {
    return {
      ok: true,
      code: MEMBER_PROMO_CODE,
      message: `${MEMBER_PROMO_CODE} saved. Add items to reach €${MEMBER_PROMO_MIN_SUBTOTAL} for 10% off.`,
    };
  }

  return {
    ok: true,
    code: MEMBER_PROMO_CODE,
    message: `${MEMBER_PROMO_CODE} applied — 10% off.`,
  };
}

export async function clearPromoCode(): Promise<void> {
  await clearAppliedPromoCode();
  revalidatePath("/cart");
  revalidatePath("/checkout");
}
