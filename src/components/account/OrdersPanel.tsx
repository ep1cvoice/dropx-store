import Image from "next/image";
import Link from "next/link";

import OrderStatusBadge from "./OrderStatusBadge";
import Button from "@/components/ui/Button";
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
      <div className="flex flex-col items-center gap-4 rounded-none border border-dashed border-black/15 px-6 py-12 text-center">
        <p className={`${inter.className} text-sm text-[#666666]`}>
          You haven&apos;t placed any orders yet.
        </p>
        <Link href="/browse-all">
          <Button
            variant="accent"
            className="h-11 cursor-pointer rounded-none px-6 text-sm font-semibold uppercase tracking-[0.12em]"
          >
            Start shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <article
          key={order.id}
          className="rounded-none border border-black/10 p-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className={`${inter.className} min-w-0`}>
              <p className="text-sm font-semibold text-[#121212]">
                Order #{order.number}
              </p>
              <p className="mt-0.5 text-xs text-[#888888]">
                {dateFormatter.format(new Date(order.placedAt))}
                &nbsp;·&nbsp;
                {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
              </p>
              <p className="mt-1 text-sm font-bold text-[#121212]">
                {formatPrice(order.total, order.currency)}
              </p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <ul className="mt-4 divide-y divide-black/10 border-t border-black/10">
            {order.items.map((item) => {
              const productHref = item.productSlug
                ? `/products/${item.productSlug}`
                : null;
              const reviewHref = item.productSlug
                ? `/products/${item.productSlug}#reviews`
                : null;

              const thumb = (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-[#f4f4f2]">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={`${item.brandName} ${item.productName}`}
                      fill
                      sizes="64px"
                      className="object-contain"
                    />
                  ) : null}
                </div>
              );

              return (
                <li
                  key={item.id}
                  className="flex flex-col gap-3 py-4 first:pt-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {productHref ? (
                      <Link
                        href={productHref}
                        className="shrink-0 transition-opacity hover:opacity-80"
                        aria-label={`View ${item.productName}`}
                      >
                        {thumb}
                      </Link>
                    ) : (
                      thumb
                    )}

                    <div className={`${inter.className} min-w-0`}>
                      <p className="truncate text-sm font-semibold text-[#121212]">
                        {item.brandName} {item.productName}
                      </p>
                      <p className="mt-0.5 text-xs text-[#888888]">
                        {item.size}
                        {item.quantity > 1 ? ` · Qty ${item.quantity}` : ""}
                      </p>
                      {productHref ? (
                        <Link
                          href={productHref}
                          className="mt-1 inline-block text-xs font-semibold text-[#e85d2a] transition-opacity hover:opacity-70"
                        >
                          View product
                        </Link>
                      ) : (
                        <p className="mt-1 text-xs text-[#999999]">
                          Product no longer available
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                    {item.canReview && reviewHref ? (
                      <Link href={reviewHref}>
                        <Button
                          variant="outline"
                          className="h-9 cursor-pointer rounded-none px-4 text-xs font-semibold uppercase tracking-[0.1em]"
                        >
                          Add a review
                        </Button>
                      </Link>
                    ) : null}
                    {item.showReviewedLink && reviewHref ? (
                      <Link
                        href={reviewHref}
                        className={`${inter.className} text-xs font-semibold text-[#2f7a45] transition-opacity hover:opacity-70`}
                      >
                        Your review
                      </Link>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </article>
      ))}
    </div>
  );
}
