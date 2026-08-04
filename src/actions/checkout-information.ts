"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { setCheckoutDraft } from "@/lib/checkout-draft";
import { getCurrentUserId } from "@/lib/cart";
import { prisma } from "@/lib/prisma";
import {
  checkoutInformationFormSchema,
  type CheckoutInformationFormValues,
} from "@/lib/validation";

export type SaveCheckoutResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

/** Validate information step, persist draft cookie, advance to payment. */
export async function saveCheckoutInformation(
  raw: CheckoutInformationFormValues,
): Promise<SaveCheckoutResult> {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const parsed = checkoutInformationFormSchema.safeParse(raw);
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

  const { saveToProfile, ...draft } = parsed.data;

  if (saveToProfile) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: draft.firstName,
        lastName: draft.lastName,
        phone: draft.phone,
        address: draft.address,
        city: draft.city,
        postalCode: draft.postalCode,
        country: draft.country,
      },
    });
    revalidatePath("/account");
    revalidatePath("/account/profile-data");
    revalidatePath("/account/addresses");
  }

  await setCheckoutDraft(draft);
  redirect("/checkout/payment");
}
