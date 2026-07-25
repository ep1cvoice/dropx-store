import type { Metadata } from "next";
import Link from "next/link";
import { Truck } from "lucide-react";

import CartLineItem from "@/components/cart/CartLineItem";
import CartSummary from "@/components/cart/CartSummary";
import Button from "@/components/ui/Button";
import { getCart } from "@/lib/cart";
import { anton, inter } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Your cart — DROPX",
};

export default async function CartPage() {
  const cart = await getCart();
  const isEmpty = cart.items.length === 0;

  return (
    <div className="flex min-h-[70vh] flex-col bg-white">
      <div className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-8 md:px-6 md:py-10 lg:px-10">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className={`${inter.className} mb-6 flex flex-wrap items-center gap-1.5 text-xs uppercase tracking-[0.12em] text-[#999999]`}
        >
          <Link href="/" className="transition-colors hover:text-[#121212]">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#121212]">Your cart</span>
        </nav>

        {/* Header */}
        <div className="flex items-end justify-between gap-4">
          <h1
            className={`${anton.className} text-4xl uppercase tracking-wide text-[#121212] md:text-5xl`}
          >
            Your cart
          </h1>
          {!isEmpty && (
            <span
              className={`${inter.className} shrink-0 text-sm text-[#888888]`}
            >
              {cart.itemCount} {cart.itemCount === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        {isEmpty ? (
          <div className="mt-16 flex flex-col items-center justify-center gap-5 py-16 text-center">
            <p className={`${inter.className} text-base text-[#666666]`}>
              Your cart is empty.
            </p>
            <Link href="/browse-all">
              <Button
                variant="accent"
                className="h-12 rounded-md px-8 text-sm font-semibold uppercase tracking-[0.12em]"
              >
                Start shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-12">
            <ul>
              {cart.items.map((item) => (
                <CartLineItem key={item.id} item={item} />
              ))}
            </ul>

            <aside className="lg:sticky lg:top-6 lg:self-start">
              <CartSummary
                subtotal={cart.subtotal}
                shipping={cart.shipping}
                total={cart.total}
                currency={cart.currency}
              />
            </aside>
          </div>
        )}
      </div>

      {/* Free-shipping banner */}
      <div
        className={`${inter.className} mt-10 flex items-center justify-center gap-2 bg-[#121212] px-4 py-3 text-center text-xs font-medium text-white`}
      >
        <Truck size={15} className="text-[#4ade80]" />
        Free shipping on all orders over €100
      </div>
    </div>
  );
}
