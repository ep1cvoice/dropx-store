"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCurrentUserId } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { MEMBER_PROMO_CODE } from "@/lib/promo";

const subscribeSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address")
    .transform((value) => value.toLowerCase()),
});

export type SubscribeNewsletterResult =
  | {
      ok: true;
      email: string;
      /** User has an active session. */
      isSignedIn: boolean;
      /** Session email matches the subscribed email → MEMBER10 unlocked. */
      codeUnlocked: boolean;
      accountEmail: string | null;
      code: typeof MEMBER_PROMO_CODE;
    }
  | { ok: false; error: string };

export async function subscribeToNewsletter(
  rawEmail: string,
): Promise<SubscribeNewsletterResult> {
  const parsed = subscribeSchema.safeParse({ email: rawEmail });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Enter a valid email address",
    };
  }

  const email = parsed.data.email;

  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existing) {
    return {
      ok: false,
      error: "This email is already subscribed to the newsletter.",
    };
  }

  await prisma.newsletterSubscriber.create({ data: { email } });

  // Resolve account email from DB via session (more reliable than JWT alone).
  const userId = await getCurrentUserId();
  let accountEmail: string | null = null;
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });
    accountEmail = user?.email.trim().toLowerCase() ?? null;
  }

  const isSignedIn = Boolean(userId && accountEmail);

  // Signed-in subscribers always unlock MEMBER10 on their account email.
  if (accountEmail && accountEmail !== email) {
    await prisma.newsletterSubscriber.upsert({
      where: { email: accountEmail },
      create: { email: accountEmail },
      update: {},
    });
  }

  const codeUnlocked = isSignedIn;

  revalidatePath("/");
  revalidatePath("/account/discount-codes");

  return {
    ok: true,
    email,
    isSignedIn,
    codeUnlocked,
    accountEmail,
    code: MEMBER_PROMO_CODE,
  };
}
