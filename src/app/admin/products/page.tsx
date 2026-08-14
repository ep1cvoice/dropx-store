import Link from "next/link";

import ProductArchiveButton from "@/components/admin/ProductArchiveButton";
import Button from "@/components/ui/Button";
import { getAdminProducts } from "@/lib/admin-data";
import { formatPrice } from "@/lib/currency";
import { anton, inter } from "@/lib/fonts";

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const products = await getAdminProducts(q);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className={`${anton.className} text-2xl uppercase tracking-wide text-[#121212]`}>
            Products
          </h1>
          <p className={`${inter.className} mt-1 text-sm text-[#666666]`}>
            {products.length} product{products.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button variant="accent">New product</Button>
        </Link>
      </div>

      <form className="mt-6 flex gap-2" action="/admin/products" method="get">
        <input
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search name, slug, brand…"
          className={`${inter.className} min-w-0 flex-1 rounded-none border border-black/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#e85d2a] sm:max-w-md`}
        />
        <Button type="submit" variant="outline" className="px-4">
          Search
        </Button>
      </form>

      <div className="mt-6 overflow-x-auto border border-black/10 bg-white">
        <table className={`${inter.className} w-full min-w-[800px] text-left text-sm`}>
          <thead>
            <tr className="border-b border-black/10 bg-[#fafafa] text-xs uppercase tracking-wide text-[#888888]">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Brand</th>
              <th className="px-4 py-3 font-medium">From</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Variants</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="cursor-pointer font-medium text-[#121212] hover:text-[#e85d2a]"
                  >
                    {p.name}
                  </Link>
                  <p className="text-xs text-[#888888]">{p.slug}</p>
                </td>
                <td className="px-4 py-3">{p.brandName}</td>
                <td className="px-4 py-3">{formatPrice(p.priceFrom, p.currency)}</td>
                <td className="px-4 py-3">{p.totalStock}</td>
                <td className="px-4 py-3">{p.variantCount}</td>
                <td className="px-4 py-3">
                  {p.archived ? (
                    <span className="text-xs font-bold uppercase tracking-wide text-[#888888]">
                      Archived
                    </span>
                  ) : (
                    <span className="text-xs font-bold uppercase tracking-wide text-[#1f9d55]">
                      Active
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className={`${inter.className} cursor-pointer text-xs font-semibold text-[#e85d2a] hover:opacity-80`}
                    >
                      Edit
                    </Link>
                    <ProductArchiveButton productId={p.id} archived={p.archived} />
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[#888888]">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
