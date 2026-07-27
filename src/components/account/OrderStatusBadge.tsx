import { inter } from "@/lib/fonts";
import type { OrderStatus } from "@/lib/orders";

const STATUS_STYLES: Record<OrderStatus, string> = {
  delivered: "bg-[#1f9d55] text-white",
  shipped: "bg-[#e85d2a] text-white",
  processing: "bg-[#d99a1c] text-white",
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`${inter.className} inline-flex shrink-0 rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}
