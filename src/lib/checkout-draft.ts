import { cookies } from "next/headers";

import {
  checkoutInformationSchema,
  type CheckoutInformationValues,
} from "@/lib/validation";

export const CHECKOUT_DRAFT_COOKIE = "dropx_checkout_draft";

const COOKIE_MAX_AGE = 60 * 60 * 6; // 6 hours

/** Read + validate the checkout information draft from the httpOnly cookie. */
export async function getCheckoutDraft(): Promise<CheckoutInformationValues | null> {
  const jar = await cookies();
  const raw = jar.get(CHECKOUT_DRAFT_COOKIE)?.value;
  if (!raw) return null;

  try {
    const parsed = checkoutInformationSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export async function setCheckoutDraft(
  data: CheckoutInformationValues,
): Promise<void> {
  const jar = await cookies();
  jar.set(CHECKOUT_DRAFT_COOKIE, JSON.stringify(data), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function clearCheckoutDraft(): Promise<void> {
  const jar = await cookies();
  jar.delete(CHECKOUT_DRAFT_COOKIE);
}
