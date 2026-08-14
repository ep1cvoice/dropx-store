import Link from "next/link";

import ProductCreateForm from "@/components/admin/ProductCreateForm";
import { getAdminBrands } from "@/lib/admin-data";
import { anton, inter } from "@/lib/fonts";

export default async function AdminNewProductPage() {
  const brands = await getAdminBrands();

  return (
    <div>
      <Link
        href="/admin/products"
        className={`${inter.className} cursor-pointer text-sm font-medium text-[#e85d2a] hover:opacity-80`}
      >
        ← Back to products
      </Link>
      <h1 className={`${anton.className} mt-4 text-2xl uppercase tracking-wide text-[#121212]`}>
        New product
      </h1>
      <p className={`${inter.className} mt-1 text-sm text-[#666666]`}>
        Creates a product with one initial colorway (EU 38–46, stock 0).
      </p>
      <div className="mt-6">
        <ProductCreateForm brands={brands} />
      </div>
    </div>
  );
}
