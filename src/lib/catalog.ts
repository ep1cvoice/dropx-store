import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type {
  ProductCardData,
  ProductCategory,
  ProductDetail,
  ProductGender,
} from "@/types/product";
import type { BadgeVariant } from "@/components/ui/Badge";
import type {
  BrandFacet,
  CollectionSlug,
  GenderFilter,
  ProductListingResult,
  SortOption,
} from "@/lib/listing";
import { isUpcoming, toIsoOrNull } from "@/lib/availability";

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
  availableAt: true,
  brand: { select: { name: true } },
  variants: {
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      price: true,
      imageUrl: true,
      sizes: { select: { stock: true } },
    },
  },
} satisfies Prisma.ProductSelect;

type ProductCardRow = Prisma.ProductGetPayload<{ select: typeof productCardSelect }>;

function toProductCardData(product: ProductCardRow): ProductCardData {
  const { variants } = product;
  const availableAt = toIsoOrNull(product.availableAt);
  const upcoming = isUpcoming(availableAt);

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
  if (upcoming) {
    stockText = "Upcoming";
  } else if (totalStock === 0) {
    stockText = "Sold out";
  } else if (totalStock <= LOW_STOCK_THRESHOLD) {
    stockText = `Only ${totalStock} left`;
  }

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand.name,
    variantId: variants[0]?.id ?? "",
    badge: product.badge as BadgeVariant | null,
    discountValue: product.discountValue,
    currency: product.currency,
    imageUrl,
    priceFrom,
    outOfStock: !upcoming && totalStock === 0,
    stockText,
    availableAt,
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
  gender: true,
  badge: true,
  discountValue: true,
  currency: true,
  availableAt: true,
  heroImageUrl: true,
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
    gender: product.gender as ProductGender,
    badge: product.badge as BadgeVariant | null,
    discountValue: product.discountValue,
    currency: product.currency,
    availableAt: toIsoOrNull(product.availableAt),
    heroImageUrl: product.heroImageUrl,
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

// ---------------------------------------------------------------------------
// Brands
// ---------------------------------------------------------------------------

export type BrandCard = {
  slug: string;
  name: string;
  productCount: number;
  imageUrl: string | null;
};

/** All brands with product counts and a representative image (for /brands grid). */
export async function getBrands(): Promise<BrandCard[]> {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    select: {
      name: true,
      slug: true,
      _count: { select: { products: true } },
      products: {
        take: 1,
        orderBy: { createdAt: "desc" },
        select: {
          variants: {
            take: 1,
            orderBy: { createdAt: "asc" },
            select: { imageUrl: true },
          },
        },
      },
    },
  });

  return brands.map((brand) => ({
    slug: brand.slug,
    name: brand.name,
    productCount: brand._count.products,
    imageUrl: brand.products[0]?.variants[0]?.imageUrl ?? null,
  }));
}

export async function getBrandBySlug(
  slug: string,
): Promise<{ name: string; slug: string } | null> {
  return prisma.brand.findUnique({
    where: { slug },
    select: { name: true, slug: true },
  });
}

export async function getAllBrandSlugs(): Promise<string[]> {
  const brands = await prisma.brand.findMany({ select: { slug: true } });
  return brands.map((b) => b.slug);
}

// ---------------------------------------------------------------------------
// Listing page — collections, filters, facets
// ---------------------------------------------------------------------------

const DEFAULT_PAGE_SIZE = 12;

function collectionWhere(collection: CollectionSlug): Prisma.ProductWhereInput {
  switch (collection) {
    case "new-drops":
      return { badge: "new" };
    case "featured":
      return { featured: true };
    case "limited":
      return { badge: "limited" };
    case "upcoming":
      return { availableAt: { gt: new Date() } };
    case "sale":
      return { discountValue: { not: null } };
    default:
      return {};
  }
}

export type ProductListingOptions = {
  collection: CollectionSlug;
  gender?: GenderFilter;
  category?: ProductCategory;
  brands?: string[]; // brand slugs
  sizes?: string[]; // bare EU numbers, e.g. ["40", "41"]
  colors?: string[]; // color families
  priceMin?: number;
  priceMax?: number;
  /** When false (default), products with zero total stock are hidden. */
  includeOutOfStock?: boolean;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
};

export async function getProductListing(
  options: ProductListingOptions,
): Promise<ProductListingResult> {
  const {
    collection,
    gender,
    category,
    brands = [],
    sizes: sizeFilters = [],
    colors = [],
    priceMin,
    priceMax,
    includeOutOfStock = false,
    sort = "newest",
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
  } = options;

  const base = collectionWhere(collection);
  const and: Prisma.ProductWhereInput[] = [];

  // Men / women listings also include unisex; Unisex is exact-match only.
  if (gender === "men") {
    and.push({ gender: { in: ["men", "unisex"] } });
  } else if (gender === "women") {
    and.push({ gender: { in: ["women", "unisex"] } });
  } else if (gender === "unisex") {
    and.push({ gender: "unisex" });
  }

  if (category) {
    and.push({ category });
  }

  if (brands.length > 0) {
    and.push({ brand: { slug: { in: brands } } });
  }
  if (sizeFilters.length > 0) {
    const euSizes = sizeFilters.map((s) => `EU ${s}`);
    and.push({
      variants: { some: { sizes: { some: { size: { in: euSizes }, stock: { gt: 0 } } } } },
    });
  }
  if (colors.length > 0) {
    and.push({ variants: { some: { colorFamily: { in: colors } } } });
  }
  if (priceMin != null || priceMax != null) {
    and.push({
      variants: {
        some: {
          price: {
            gte: priceMin ?? undefined,
            lte: priceMax ?? undefined,
          },
        },
      },
    });
  }

  // Default shop view: only products that still have at least one size in stock.
  if (!includeOutOfStock) {
    and.push({
      variants: { some: { sizes: { some: { stock: { gt: 0 } } } } },
    });
  }

  const where: Prisma.ProductWhereInput =
    and.length > 0 ? { ...base, AND: and } : base;

  // Brand facets stay scoped to the collection (+ stock rule), not other filters,
  // so counts remain stable while toggling brand/size/color.
  const facetWhere: Prisma.ProductWhereInput = !includeOutOfStock
    ? {
        ...base,
        AND: [
          { variants: { some: { sizes: { some: { stock: { gt: 0 } } } } } },
        ],
      }
    : base;

  // Products + brand facets in parallel — avoids waiting on a second round-trip.
  const [rows, allBrands, grouped] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: productCardSelect,
    }),
    prisma.brand.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
    prisma.product.groupBy({
      by: ["brandId"],
      where: facetWhere,
      _count: { _all: true },
    }),
  ]);

  let products = rows.map(toProductCardData);

  if (sort === "price-asc") {
    products = products.sort((a, b) => a.priceFrom - b.priceFrom);
  } else if (sort === "price-desc") {
    products = products.sort((a, b) => b.priceFrom - a.priceFrom);
  }

  // Keep sold-out items at the end when they're included.
  if (includeOutOfStock) {
    products = products.sort(
      (a, b) => Number(a.outOfStock) - Number(b.outOfStock),
    );
  }

  const total = products.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const paged = products.slice(start, start + pageSize);

  const countByBrand = new Map(grouped.map((g) => [g.brandId, g._count._all]));
  const brandFacets: BrandFacet[] = allBrands
    .map((b) => ({ slug: b.slug, name: b.name, count: countByBrand.get(b.id) ?? 0 }))
    .filter((b) => b.count > 0);

  return {
    products: paged,
    total,
    page: safePage,
    pageSize,
    totalPages,
    brandFacets,
  };
}
