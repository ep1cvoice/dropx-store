import Image from "next/image";

import OrderStatusBadge from "./OrderStatusBadge";
import { formatPrice } from "@/lib/currency";
import { getOrders } from "@/lib/orders";
import { inter } from "@/lib/fonts";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

export default async function OrdersPanel() {
  const orders = await getOrders();

  if (orders.length === 0) {
    return (
      <p className={`${inter.className} text-sm text-[#666666]`}>
        You haven&apos;t placed any orders yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="flex items-center gap-4 rounded-xl border border-black/10 p-4"
        >
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#eef4ff]">
            {order.thumbnailUrl && (
              <Image
                src={order.thumbnailUrl}
                alt={`Order ${order.number}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            )}
          </div>

          <div className={`${inter.className} min-w-0 flex-1`}>
            <p className="text-sm font-semibold text-[#121212]">
              Order #{order.number}
            </p>
            <p className="mt-0.5 text-xs text-[#888888]">
              {dateFormatter.format(order.placedAt)} &nbsp;·&nbsp;{" "}
              {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
            </p>
            <p className="mt-1 text-sm font-bold text-[#121212]">
              {formatPrice(order.total, order.currency)}
            </p>
          </div>

          <OrderStatusBadge status={order.status} />
        </div>
      ))}
    </div>
  );
}
