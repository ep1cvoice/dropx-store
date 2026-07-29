import { cookies } from "next/headers";

import { getCurrentUserEmail } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import {
  MEMBER_PROMO_CODE,
  MEMBER_PROMO_MIN_SUBTOTAL,
  PROMO_COOKIE,
  PROMO_COOKIE_MAX_AGE,
  isMemberPromoCode,
  memberDiscountAmount,
  normalizePromoCode,
} from "@/lib/promo";

export async function isEmailSubscribed(email: string): Promise<boolean> {
  const row = await prisma.newsletterSubscriber.findUnique({
    where: { email: email.trim().toLowerCase() },
    select: { id: true },
  });
  return Boolean(row);
}

/** Logged-in user whose account email is on the newsletter list. */
export async function isCurrentUserPromoEligible(): Promise<boolean> {
  const email = await getCurrentUserEmail();
  if (!email) return false;
  return isEmailSubscribed(email);
}

export async function getAppliedPromoCode(): Promise<string | null> {
  const jar = await cookies();
  const raw = jar.get(PROMO_COOKIE)?.value;
  if (!raw) return null;
  const code = normalizePromoCode(raw);
  return code || null;
}

export async function setAppliedPromoCode(code: string): Promise<void> {
  const jar = await cookies();
  jar.set(PROMO_COOKIE, normalizePromoCode(code), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: PROMO_COOKIE_MAX_AGE,
  });
}

export async function clearAppliedPromoCode(): Promise<void> {
  const jar = await cookies();
  jar.delete(PROMO_COOKIE);
}

export type ResolvedPromo = {
  promoCode: string | null;
  discount: number;
};

/**
 * Resolve cookie promo against eligibility + cart subtotal.
 * Read-only — does not mutate cookies (safe from Server Components).
 */
export async function resolveCartPromo(subtotal: number): Promise<ResolvedPromo> {
  const applied = await getAppliedPromoCode();
  if (!applied || !isMemberPromoCode(applied)) {
    return { promoCode: null, discount: 0 };
  }

  const eligible = await isCurrentUserPromoEligible();
  if (!eligible) {
    return { promoCode: null, discount: 0 };
  }

  const discount = memberDiscountAmount(subtotal);
  return {
    promoCode: MEMBER_PROMO_CODE,
    discount,
  };
}

export { MEMBER_PROMO_CODE, MEMBER_PROMO_MIN_SUBTOTAL };
