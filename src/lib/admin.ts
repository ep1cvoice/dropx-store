import { redirect } from "next/navigation";

import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@/generated/prisma/client";
import type { Prisma } from "@/generated/prisma/client";

export type AdminActor = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

/** Throws redirect if the current session is not an ADMIN. Use in RSC layouts/pages. */
export async function requireAdmin(): Promise<AdminActor> {
  const admin = await getAdminActor();
  if (!admin) {
    const session = await auth();
    if (!session?.user?.id) redirect("/login?callbackUrl=/admin");
    redirect("/");
  }
  return admin;
}

/**
 * Non-throwing admin check for server actions.
 * Redirects inside actions get swallowed by client try/catch and look like vague failures.
 */
export async function getAdminActor(): Promise<AdminActor | null> {
  const session = await auth();
  const userId = session?.user?.id;
  const email = session?.user?.email ?? undefined;

  if (!userId && !email) return null;

  const user = userId
    ? await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true, lastName: true, role: true },
      })
    : await prisma.user.findUnique({
        where: { email: email! },
        select: { id: true, email: true, name: true, lastName: true, role: true },
      });

  if (!user || user.role !== "ADMIN") return null;

  return {
    id: user.id,
    email: user.email,
    name: `${user.name} ${user.lastName}`.trim(),
    role: user.role,
  };
}

export async function logAdminActivity(input: {
  actorId: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  message: string;
  meta?: Prisma.InputJsonValue;
}) {
  try {
    await prisma.adminActivity.create({
      data: {
        actorId: input.actorId,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId ?? null,
        message: input.message,
        meta: input.meta,
      },
    });
  } catch (e) {
    // Never block the primary admin mutation on audit-log failure.
    console.error("[admin] failed to write activity log", e);
  }
}
