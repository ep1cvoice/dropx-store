import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";

/**
 * Resolve the current user's id from the session.
 * Prefer JWT user id; fall back to case-insensitive email lookup.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await auth();
  const userId = session?.user?.id;
  if (userId) return userId;

  const email = session?.user?.email?.trim();
  if (!email) return null;

  const user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    select: { id: true },
  });

  return user?.id ?? null;
}

/** Account email for the signed-in user (lowercased), or null. */
export async function getCurrentUserEmail(): Promise<string | null> {
  const userId = await getCurrentUserId();
  if (!userId) {
    // Last resort: session email before JWT id callbacks existed.
    const session = await auth();
    const email = session?.user?.email?.trim().toLowerCase();
    return email || null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  return user?.email.trim().toLowerCase() ?? null;
}
