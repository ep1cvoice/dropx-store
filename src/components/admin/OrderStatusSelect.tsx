"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { updateOrderStatus } from "@/actions/admin/orders";
import { inter } from "@/lib/fonts";
import type { OrderStatus } from "@/lib/order-status";

const STATUSES: OrderStatus[] = ["processing", "shipped", "delivered"];

type OrderStatusSelectProps = {
  orderId: string;
  currentStatus: OrderStatus;
};

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: OrderStatusSelectProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const status = e.target.value as OrderStatus;
    startTransition(async () => {
      await updateOrderStatus(orderId, status);
      router.refresh();
    });
  }

  return (
    <select
      value={currentStatus}
      disabled={pending}
      onChange={handleChange}
      className={`${inter.className} rounded-none border border-black/15 bg-white px-3 py-2 text-sm font-medium outline-none focus:border-[#e85d2a] disabled:opacity-50`}
      aria-label="Order status"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
