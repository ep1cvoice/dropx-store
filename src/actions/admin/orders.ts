"use server";

import { revalidatePath } from "next/cache";

import { logAdminActivity, requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@/generated/prisma/client";

export type OrderActionResult = { ok: true } | { ok: false; error: string };

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<OrderActionResult> {
  const admin = await requireAdmin();

  const existing = await prisma.order.findUnique({
    where: { id: orderId },
    select: { status: true, number: true },
  });
  if (!existing) return { ok: false, error: "Order not found." };

  if (existing.status === status) return { ok: true };

  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  await logAdminActivity({
    actorId: admin.id,
    action: "order.status",
    entityType: "order",
    entityId: orderId,
    message: `Order ${existing.number} status changed from ${existing.status} to ${status}`,
    meta: { from: existing.status, to: status },
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { ok: true };
}
