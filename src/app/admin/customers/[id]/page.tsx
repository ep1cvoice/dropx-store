import Link from "next/link";
import { notFound } from "next/navigation";

import OrderStatusBadge from "@/components/account/OrderStatusBadge";
import { getAdminCustomer } from "@/lib/admin-data";
import { formatPrice } from "@/lib/currency";
import { anton, inter } from "@/lib/fonts";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminCustomerDetailPage({ params }: PageProps) {
  const { id } = await params;
  const customer = await getAdminCustomer(id);
  if (!customer) notFound();

  return (
    <div>
      <Link
        href="/admin/customers"
        className={`${inter.className} cursor-pointer text-sm font-medium text-[#e85d2a] hover:opacity-80`}
      >
        ← Back to customers
      </Link>

      <h1 className={`${anton.className} mt-4 text-2xl uppercase tracking-wide text-[#121212]`}>
        {customer.name}
      </h1>
      <p className={`${inter.className} mt-1 text-sm text-[#666666]`}>{customer.email}</p>

      <section className="mt-8 border border-black/10 bg-white p-5">
        <h2 className={`${inter.className} text-xs font-semibold uppercase tracking-wide text-[#888888]`}>
          Profile
        </h2>
        <dl className={`${inter.className} mt-3 grid gap-3 text-sm sm:grid-cols-2`}>
          <div>
            <dt className="text-[#888888]">Phone</dt>
            <dd>{customer.phone ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-[#888888]">Joined</dt>
            <dd>{new Date(customer.createdAt).toLocaleDateString()}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-[#888888]">Address</dt>
            <dd>
              {customer.address
                ? `${customer.address}, ${customer.postalCode ?? ""} ${customer.city ?? ""}, ${customer.country ?? ""}`.trim()
                : "—"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-6">
        <h2 className={`${inter.className} text-sm font-semibold uppercase tracking-wide text-[#666666]`}>
          Orders ({customer.orders.length})
        </h2>
        <div className="mt-3 overflow-x-auto border border-black/10 bg-white">
          <table className={`${inter.className} w-full min-w-[560px] text-left text-sm`}>
            <thead>
              <tr className="border-b border-black/10 bg-[#fafafa] text-xs uppercase tracking-wide text-[#888888]">
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {customer.orders.map((o) => (
                <tr key={o.id} className="border-b border-black/5 last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="cursor-pointer font-medium text-[#e85d2a] hover:opacity-80"
                    >
                      {o.number}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{o.itemCount}</td>
                  <td className="px-4 py-3">{formatPrice(o.total, o.currency)}</td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={o.status} />
                  </td>
                  <td className="px-4 py-3 text-[#666666]">
                    {new Date(o.placedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {customer.orders.length === 0 && (
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
