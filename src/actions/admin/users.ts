"use server";

import { revalidatePath } from "next/cache";

import { logAdminActivity, requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@/generated/prisma/client";

export type UserActionResult = { ok: true } | { ok: false; error: string };

export async function setUserRole(
  userId: string,
  role: UserRole,
): Promise<UserActionResult> {
  const admin = await requireAdmin();

  if (userId === admin.id && role !== "ADMIN") {
    return { ok: false, error: "You cannot demote yourself." };
  }

  const existing = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, email: true, name: true, lastName: true },
  });
  if (!existing) return { ok: false, error: "User not found." };

  if (existing.role === role) return { ok: true };

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  const displayName = `${existing.name} ${existing.lastName}`.trim();

  await logAdminActivity({
    actorId: admin.id,
    action: "user.role",
    entityType: "user",
    entityId: userId,
    message: `Role for ${displayName} (${existing.email}) changed from ${existing.role} to ${role}`,
    meta: { from: existing.role, to: role },
  });

  revalidatePath("/admin/users");
  return { ok: true };
}
