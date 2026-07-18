import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type {
  ProductCardData,
  ProductCategory,
  ProductDetail,
} from "@/types/product";
import type { BadgeVariant } from "@/components/ui/Badge";

/** At or below this remaining stock, cards show a "Only N left" nudge. */
const LOW_STOCK_THRESHOLD = 5;

// Shared projection for catalog/listing pages. Deliberately avoids pulling full
// variant/size rows into the component — only what a card needs to render.
const productCardSelect = {
  id: true,
  slug: true,
  name: true,
  badge: true,
  discountValue: true,
  currency: true,
  brand: { select: { name: true } },
  variants: {
    orderBy: { createdAt: "asc" },
    select: {
      price: true,
      imageUrl: true,
      sizes: { select: { stock: true } },
    },
  },
} satisfies Prisma.ProductSelect;

type ProductCardRow = Prisma.ProductGetPayload<{ select: typeof productCardSelect }>;

function toProductCardData(product: ProductCardRow): ProductCardData {
  const { variants } = product;

  const priceFrom = variants.length
    ? Math.min(...variants.map((v) => v.price))
    : 0;

  // Default variant = first by creation order; fall back to any variant image.
  const imageUrl =
    variants[0]?.imageUrl ??
    variants.find((v) => v.imageUrl)?.imageUrl ??
    null;

  const totalStock = variants.reduce(
    (sum, v) => sum + v.sizes.reduce((s, size) => s + size.stock, 0),
    0,
  );

  let stockText: string | null = null;
  if (totalStock === 0) {
    stockText = "Sold out";
  } else if (totalStock <= LOW_STOCK_THRESHOLD) {
    stockText = `Only ${totalStock} left`;
  }

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand.name,
    badge: product.badge,
    discountValue: product.discountValue,
    currency: product.currency,
    imageUrl,
    priceFrom,
    stockText,
  };
}

export type GetProductCardsOptions = {
  /** Max number of products to return. */
  take?: number;
  /** Number of products to skip (for paging / section variety). */
  skip?: number;
  /** Restrict to a product category. */
  category?: ProductCategory;
  /** Restrict to a brand by its slug (e.g. "nike"). */
  brandSlug?: string;
  /** Only products with a discount. */
  onSale?: boolean;
};

/**
 * Fetch products as lightweight `ProductCardData` for listing/grid UIs.
 * Newest first. Price, image, and low-stock text are derived from variants.
 */
export async function getProductCards(
  options: GetProductCardsOptions = {},
): Promise<ProductCardData[]> {
  const { take, skip, category, brandSlug, onSale } = options;

  const where: Prisma.ProductWhereInput = {};
  if (category) where.category = category;
  if (brandSlug) where.brand = { slug: brandSlug };
  if (onSale) where.discountValue = { not: null };

  const products = await prisma.product.findMany({
    where,
    take,
    skip,
    orderBy: { createdAt: "desc" },
    select: productCardSelect,
  });

  return products.map(toProductCardData);
}

// ---------------------------------------------------------------------------
// Product detail
// ---------------------------------------------------------------------------

const productDetailSelect = {
  id: true,
  slug: true,
  name: true,
  description: true,
  category: true,
  badge: true,
  discountValue: true,
  currency: true,
  createdAt: true,
  updatedAt: true,
  brand: { select: { name: true } },
  variants: {
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      productId: true,
      color: true,
      colorHex: true,
      imageUrl: true,
      price: true,
      createdAt: true,
      updatedAt: true,
      sizes: {
        orderBy: { size: "asc" },
        select: { id: true, variantId: true, size: true, stock: true },
      },
    },
  },
} satisfies Prisma.ProductSelect;

type ProductDetailRow = Prisma.ProductGetPayload<{
  select: typeof productDetailSelect;
}>;

function toProductDetail(product: ProductDetailRow): ProductDetail {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    brand: product.brand.name,
    category: product.category as ProductCategory,
    badge: product.badge as BadgeVariant | null,
    discountValue: product.discountValue,
    currency: product.currency,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    variants: product.variants.map((variant) => ({
      id: variant.id,
      productId: variant.productId,
      color: variant.color,
      colorHex: variant.colorHex,
      imageUrl: variant.imageUrl,
      price: variant.price,
      createdAt: variant.createdAt,
      updatedAt: variant.updatedAt,
      sizes: variant.sizes.map((size) => ({
        id: size.id,
        variantId: size.variantId,
        size: size.size,
        stock: size.stock,
      })),
    })),
  };
}

/** Full product (variants + per-size stock) for the details page. */
export async function getProductBySlug(
  slug: string,
): Promise<ProductDetail | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    select: productDetailSelect,
  });

  return product ? toProductDetail(product) : null;
}

/** Every product slug — used by generateStaticParams to prerender detail pages. */
export async function getAllProductSlugs(): Promise<string[]> {
  const products = await prisma.product.findMany({ select: { slug: true } });
  return products.map((p) => p.slug);
}

/**
 * Cards for a "you might also like" rail: same category first, excluding the
 * current product, topped up with other products if needed.
 */
export async function getRelatedProducts(
  slug: string,
  category: ProductCategory,
  take = 4,
): Promise<ProductCardData[]> {
  const sameCategory = await prisma.product.findMany({
    where: { slug: { not: slug }, category },
    take,
    orderBy: { createdAt: "desc" },
    select: productCardSelect,
  });

  let rows = sameCategory;

  if (rows.length < take) {
    const excludeSlugs = [slug, ...rows.map((r) => r.slug)];
    const filler = await prisma.product.findMany({
      where: { slug: { notIn: excludeSlugs } },
      take: take - rows.length,
      orderBy: { createdAt: "desc" },
      select: productCardSelect,
    });
    rows = [...rows, ...filler];
  }

  return rows.map(toProductCardData);
}
