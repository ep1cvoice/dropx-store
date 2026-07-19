import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductListingPage from "@/components/listing/ProductListingPage";
import { getAllBrandSlugs, getBrandBySlug } from "@/lib/catalog";

type BrandPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateStaticParams() {
  const slugs = await getAllBrandSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  if (!brand) {
    return { title: "Brand not found — DROPX" };
  }

  return {
    title: `${brand.name} — DROPX`,
    description: `Shop ${brand.name} sneakers at DROPX.`,
  };
}

export default async function BrandPage({
  params,
  searchParams,
}: BrandPageProps) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  const resolved = await searchParams;

  return (
    <ProductListingPage
      title={brand.name}
      searchParams={resolved}
      lockedBrandSlug={brand.slug}
    />
  );
}
