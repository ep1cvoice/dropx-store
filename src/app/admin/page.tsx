import Link from "next/link";

import OrderStatusBadge from "@/components/account/OrderStatusBadge";
import { getAdminDashboardStats } from "@/lib/admin-data";
import { formatPrice } from "@/lib/currency";
import { anton, inter } from "@/lib/fonts";

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-black/10 bg-white px-5 py-4">
      <p className={`${inter.className} text-xs font-medium uppercase tracking-wide text-[#888888]`}>
        {label}
      </p>
      <p className={`${anton.className} mt-1 text-3xl tracking-wide text-[#121212]`}>{value}</p>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();

  return (
    <div>
      <h1 className={`${anton.className} text-2xl uppercase tracking-wide text-[#121212]`}>
        Dashboard
      </h1>
      <p className={`${inter.className} mt-1 text-sm text-[#666666]`}>
        Store overview at a glance.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatTile label="Orders today" value={stats.ordersToday} />
        <StatTile label="All orders" value={stats.ordersAll} />
        <StatTile label="Revenue" value={formatPrice(stats.revenue, "EUR")} />
        <StatTile label="Customers" value={stats.customers} />
        <StatTile label="Products" value={stats.products} />
      </div>

      <section className="mt-10">
        <h2 className={`${inter.className} text-sm font-semibold uppercase tracking-wide text-[#666666]`}>
          Recent orders
        </h2>
        <div className="mt-3 overflow-x-auto border border-black/10 bg-white">
          <table className={`${inter.className} w-full min-w-[640px] text-left text-sm`}>
            <thead>
              <tr className="border-b border-black/10 bg-[#fafafa] text-xs uppercase tracking-wide text-[#888888]">
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-black/5 last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium text-[#e85d2a] hover:opacity-80"
                    >
                      {order.number}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[#333333]">{order.customerName}</td>
                  <td className="px-4 py-3">{formatPrice(order.total, order.currency)}</td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 text-[#666666]">
                    {new Date(order.placedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {stats.recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[#888888]">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
