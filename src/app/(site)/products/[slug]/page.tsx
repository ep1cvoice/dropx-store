import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import ProductCard from "@/components/product/ProductCard";
import ProductDetailView from "@/components/product/ProductDetailView";
import AtomicReveal from "@/components/ui/AtomicReveal";
import ProductGridSkeleton from "@/components/ui/ProductGridSkeleton";
import {
  getAllProductSlugs,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/catalog";
import { anton, inter } from "@/lib/fonts";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product not found — DROPX" };
  }

  return {
    title: `${product.brand} ${product.name} — DROPX`,
    description:
      product.description ??
      `Shop the ${product.brand} ${product.name} at DROPX.`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product.slug, product.category);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1600px] px-4 py-8 md:px-6 md:py-10 lg:px-10">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className={`${inter.className} mb-6 flex flex-wrap items-center gap-1.5 text-xs uppercase tracking-[0.12em] text-[#999999]`}
      >
        <Link href="/" className="transition-colors hover:text-[#121212]">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          href="/browse-all?collection=new-drops"
          className="transition-colors hover:text-[#121212]"
        >
          New Drops
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-[#121212]">
          {product.brand} {product.name}
        </span>
      </nav>

      <ProductDetailView product={product} />

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16 md:mt-24">
          <h2
            className={`${anton.className} text-3xl uppercase tracking-wide text-[#121212] md:text-4xl`}
          >
            You might also like
          </h2>
          <AtomicReveal
            className="mt-6"
            fallback={
              <div className="mt-6">
                <ProductGridSkeleton
                  count={Math.min(related.length, 4)}
                  className="grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
                />
              </div>
            }
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </AtomicReveal>
        </section>
      )}
      </div>
    </div>
  );
}
