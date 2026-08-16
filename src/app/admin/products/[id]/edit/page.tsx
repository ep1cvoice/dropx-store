import Link from "next/link";
import { notFound } from "next/navigation";

import ProductEditForm from "@/components/admin/ProductEditForm";
import { getAdminBrands, getAdminProduct } from "@/lib/admin-data";
import { anton, inter } from "@/lib/fonts";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditProductPage({ params }: PageProps) {
  const { id } = await params;
  const [product, brands] = await Promise.all([
    getAdminProduct(id),
    getAdminBrands(),
  ]);

  if (!product) notFound();

  return (
    <div>
      <Link
        href="/admin/products"
        className={`${inter.className} cursor-pointer text-sm font-medium text-[#e85d2a] hover:opacity-80`}
      >
        ← Back to products
      </Link>
      <h1 className={`${anton.className} mt-4 text-2xl uppercase tracking-wide text-[#121212]`}>
        Edit product
      </h1>
      <p className={`${inter.className} mt-1 text-sm text-[#666666]`}>{product.name}</p>
      <div className="mt-6">
        <ProductEditForm
          brands={brands}
          product={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            brandId: product.brandId,
            category: product.category,
            gender: product.gender,
            description: product.description,
            badge: product.badge,
            discountValue: product.discountValue,
            featured: product.featured,
            availableAt: (() => {
              if (!product.availableAt) return null;
              const d =
                product.availableAt instanceof Date
                  ? product.availableAt
                  : new Date(product.availableAt);
              return Number.isNaN(d.getTime()) ? null : d.toISOString();
            })(),
            heroImageUrl: product.heroImageUrl,
            archived: product.archived,
            variants: product.variants.map((v) => ({
              id: v.id,
              color: v.color,
              colorHex: v.colorHex,
              colorFamily: v.colorFamily,
              price: v.price,
              imageUrl: v.imageUrl,
              description: v.description,
              sizes: v.sizes.map((s) => ({
                id: s.id,
                size: s.size,
                stock: s.stock,
              })),
            })),
          }}
        />
      </div>
    </div>
  );
}
