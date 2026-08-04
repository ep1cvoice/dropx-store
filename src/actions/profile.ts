"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUserId } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import {
  changeEmailSchema,
  changePasswordSchema,
  profileDataSchema,
  type ChangeEmailValues,
  type ChangePasswordValues,
  type ProfileDataValues,
} from "@/lib/validation";
import { saltAndHashPassword, verifyPassword } from "@/utils/password";

export type UpdateProfileResult =
  | { ok: true }
  | {
      ok: false;
      error?: string;
      fieldErrors?: Partial<Record<keyof ProfileDataValues, string[]>>;
    };

export async function updateProfileData(
  data: ProfileDataValues,
): Promise<UpdateProfileResult> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return { ok: false, error: "You must be signed in." };
  }

  const parsed = profileDataSchema.safeParse(data);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof ProfileDataValues, string[]>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof ProfileDataValues | undefined;
      if (!key) continue;
      fieldErrors[key] = [...(fieldErrors[key] ?? []), issue.message];
    }
    return { ok: false, fieldErrors };
  }

  const { firstName, lastName, phone, address, city, postalCode, country } =
    parsed.data;

  await prisma.user.update({
    where: { id: userId },
    data: {
      name: firstName,
      lastName,
      phone,
      address,
      city,
      postalCode,
      country,
    },
  });

  revalidatePath("/account");
  revalidatePath("/account/profile-data");

  return { ok: true };
}

export type ChangeEmailResult =
  | { ok: true; email: string }
  | {
      ok: false;
      error?: string;
      fieldErrors?: Partial<Record<keyof ChangeEmailValues, string[]>>;
    };

/** Mock email-change: no verification mail is sent — DB email updates immediately. */
export async function changeEmail(
  data: ChangeEmailValues,
): Promise<ChangeEmailResult> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return { ok: false, error: "You must be signed in." };
  }

  const parsed = changeEmailSchema.safeParse(data);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof ChangeEmailValues, string[]>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof ChangeEmailValues | undefined;
      if (!key) continue;
      fieldErrors[key] = [...(fieldErrors[key] ?? []), issue.message];
    }
    return { ok: false, fieldErrors };
  }

  const email = parsed.data.email.toLowerCase();

  const current = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });
  if (!current) {
    return { ok: false, error: "Account not found." };
  }

  if (current.email.toLowerCase() === email) {
    return {
      ok: false,
      fieldErrors: { email: ["This is already your email address"] },
    };
  }

  const taken = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (taken) {
    return {
      ok: false,
      fieldErrors: { email: ["This email is already in use"] },
    };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { email },
  });

  revalidatePath("/account");
  revalidatePath("/account/profile-data");

  return { ok: true, email };
}

export type ChangePasswordResult =
  | { ok: true }
  | {
      ok: false;
      error?: string;
      fieldErrors?: Partial<Record<keyof ChangePasswordValues, string[]>>;
    };

export async function changePassword(
  data: ChangePasswordValues,
): Promise<ChangePasswordResult> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return { ok: false, error: "You must be signed in." };
  }

  const parsed = changePasswordSchema.safeParse(data);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof ChangePasswordValues, string[]>> =
      {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof ChangePasswordValues | undefined;
      if (!key) continue;
      fieldErrors[key] = [...(fieldErrors[key] ?? []), issue.message];
    }
    return { ok: false, fieldErrors };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { password: true },
  });

  if (!user) {
    return { ok: false, error: "Account not found." };
  }

  const matches = await verifyPassword(
    parsed.data.currentPassword,
    user.password,
  );
  if (!matches) {
    return {
      ok: false,
      fieldErrors: { currentPassword: ["Current password is incorrect"] },
    };
  }

  const hashed = await saltAndHashPassword(parsed.data.newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed },
  });

  return { ok: true };
}
