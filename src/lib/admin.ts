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

/** Throws redirect if the current session is not an ADMIN. */
export async function requireAdmin(): Promise<AdminActor> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login?callbackUrl=/admin");

  // Prefer live DB role so demotions take effect even with a stale JWT.
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, lastName: true, role: true },
  });

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

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
}
