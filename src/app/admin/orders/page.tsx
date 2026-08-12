import Link from "next/link";

import OrderStatusBadge from "@/components/account/OrderStatusBadge";
import { getAdminOrders } from "@/lib/admin-data";
import { formatPrice } from "@/lib/currency";
import { anton, inter } from "@/lib/fonts";
import type { OrderStatus } from "@/generated/prisma/client";

const STATUSES: (OrderStatus | "all")[] = ["all", "processing", "shipped", "delivered"];

type PageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const { status: statusParam } = await searchParams;
  const status =
    statusParam && statusParam !== "all"
      ? (statusParam as OrderStatus)
      : undefined;
  const orders = await getAdminOrders(status);

  return (
    <div>
      <h1 className={`${anton.className} text-2xl uppercase tracking-wide text-[#121212]`}>
        Orders
      </h1>
      <p className={`${inter.className} mt-1 text-sm text-[#666666]`}>
        {orders.length} order{orders.length === 1 ? "" : "s"}
      </p>

      <div className={`${inter.className} mt-4 flex flex-wrap gap-2`}>
        {STATUSES.map((s) => {
          const href = s === "all" ? "/admin/orders" : `/admin/orders?status=${s}`;
          const active =
            s === "all" ? !status : status === s;
          return (
            <Link
              key={s}
              href={href}
              className={`rounded-none border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                active
                  ? "border-[#e85d2a] bg-[#e85d2a] text-white"
                  : "border-black/15 bg-white text-[#333333] hover:border-black/25"
              }`}
            >
              {s}
            </Link>
          );
        })}
      </div>

      <div className="mt-6 overflow-x-auto border border-black/10 bg-white">
        <table className={`${inter.className} w-full min-w-[720px] text-left text-sm`}>
          <thead>
            <tr className="border-b border-black/10 bg-[#fafafa] text-xs uppercase tracking-wide text-[#888888]">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="font-medium text-[#e85d2a] hover:opacity-80"
                  >
                    {o.number}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <p className="text-[#333333]">{`${o.firstName} ${o.lastName}`.trim()}</p>
                  <p className="text-xs text-[#888888]">{o.email}</p>
                </td>
                <td className="px-4 py-3">{o._count.items}</td>
                <td className="px-4 py-3">{formatPrice(o.total, o.currency)}</td>
                <td className="px-4 py-3">
                  <OrderStatusBadge status={o.status} />
                </td>
                <td className="px-4 py-3 text-[#666666]">
                  {o.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[#888888]">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
