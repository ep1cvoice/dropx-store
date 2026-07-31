"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUserId } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import {
  changePasswordSchema,
  profileDataSchema,
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
      phone: phone || null,
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
