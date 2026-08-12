import Link from "next/link";
import { notFound } from "next/navigation";

import OrderStatusBadge from "@/components/account/OrderStatusBadge";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import { getAdminOrder } from "@/lib/admin-data";
import { formatPrice } from "@/lib/currency";
import { anton, inter } from "@/lib/fonts";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const order = await getAdminOrder(id);
  if (!order) notFound();

  const customerName = `${order.firstName} ${order.lastName}`.trim();

  return (
    <div>
      <Link
        href="/admin/orders"
        className={`${inter.className} text-sm font-medium text-[#e85d2a] hover:opacity-80`}
      >
        ← Back to orders
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className={`${anton.className} text-2xl uppercase tracking-wide text-[#121212]`}>
            {order.number}
          </h1>
          <p className={`${inter.className} mt-1 text-sm text-[#666666]`}>
            Placed {order.createdAt.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.status} />
          <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="border border-black/10 bg-white p-5">
          <h2 className={`${inter.className} text-xs font-semibold uppercase tracking-wide text-[#888888]`}>
            Customer
          </h2>
          <dl className={`${inter.className} mt-3 space-y-2 text-sm`}>
            <div>
              <dt className="text-[#888888]">Name</dt>
              <dd className="font-medium">{customerName}</dd>
            </div>
            <div>
              <dt className="text-[#888888]">Email</dt>
              <dd>{order.email}</dd>
            </div>
            {order.phone && (
              <div>
                <dt className="text-[#888888]">Phone</dt>
                <dd>{order.phone}</dd>
              </div>
            )}
            <div>
              <dt className="text-[#888888]">Account</dt>
              <dd>
                <Link
                  href={`/admin/customers/${order.user.id}`}
                  className="text-[#e85d2a] hover:opacity-80"
                >
                  View profile
                </Link>
              </dd>
            </div>
          </dl>
        </section>

        <section className="border border-black/10 bg-white p-5">
          <h2 className={`${inter.className} text-xs font-semibold uppercase tracking-wide text-[#888888]`}>
            Shipping
          </h2>
          <dl className={`${inter.className} mt-3 space-y-2 text-sm`}>
            <div>
              <dt className="text-[#888888]">Address</dt>
              <dd>
                {order.address}, {order.postalCode} {order.city}, {order.country}
              </dd>
            </div>
            <div>
              <dt className="text-[#888888]">Method</dt>
              <dd>{order.shippingMethod}</dd>
            </div>
            <div>
              <dt className="text-[#888888]">Payment</dt>
              <dd>{order.paymentMethod}</dd>
            </div>
          </dl>
        </section>
      </div>

      <section className="mt-6 border border-black/10 bg-white">
        <h2 className={`${inter.className} border-b border-black/10 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#888888]`}>
          Items
        </h2>
        <ul className={`${inter.className} divide-y divide-black/5 text-sm`}>
          {order.items.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div>
                <p className="font-medium">{item.productName}</p>
                <p className="text-xs text-[#888888]">
                  {item.brandName} · {item.color} · {item.size} × {item.quantity}
                </p>
              </div>
              <p className="font-medium">
                {formatPrice(item.unitPrice * item.quantity, order.currency)}
              </p>
            </li>
          ))}
        </ul>
        <div className={`${inter.className} border-t border-black/10 px-5 py-4 text-sm`}>
          <div className="flex justify-between">
            <span className="text-[#666666]">Subtotal</span>
            <span>{formatPrice(order.subtotal, order.currency)}</span>
          </div>
          <div className="mt-1 flex justify-between">
            <span className="text-[#666666]">Shipping</span>
            <span>{formatPrice(order.shipping, order.currency)}</span>
          </div>
          {order.discount > 0 && (
            <div className="mt-1 flex justify-between">
              <span className="text-[#666666]">Discount</span>
              <span>-{formatPrice(order.discount, order.currency)}</span>
            </div>
          )}
          <div className="mt-2 flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatPrice(order.total, order.currency)}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
