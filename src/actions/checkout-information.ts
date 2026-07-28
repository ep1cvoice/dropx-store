"use server";

import { redirect } from "next/navigation";

import { setCheckoutDraft } from "@/lib/checkout-draft";
import { getCurrentUserId } from "@/lib/cart";
import {
  checkoutInformationSchema,
  type CheckoutInformationValues,
} from "@/lib/validation";

export type SaveCheckoutResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

/** Validate information step, persist draft cookie, advance to payment. */
export async function saveCheckoutInformation(
  raw: CheckoutInformationValues,
): Promise<SaveCheckoutResult> {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const parsed = checkoutInformationSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key !== "string") continue;
      fieldErrors[key] ??= [];
      fieldErrors[key].push(issue.message);
    }
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors,
    };
  }

  await setCheckoutDraft(parsed.data);
  redirect("/checkout/payment");
}
