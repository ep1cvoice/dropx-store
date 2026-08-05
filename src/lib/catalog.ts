import { cache } from "react";

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
import { interleaveByBrand } from "@/lib/interleave-by-brand";
import { pickCardVariant } from "@/lib/pick-card-variant";
import { sizesFitGender } from "@/lib/sizes";

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
      colorFamily: true,
      sizes: { select: { stock: true } },
    },
  },
} satisfies Prisma.ProductSelect;

type ProductCardRow = Prisma.ProductGetPayload<{ select: typeof productCardSelect }>;

function toProductCardData(
  product: ProductCardRow,
  preferredColorFamilies?: string[],
): ProductCardData {
  const { variants } = product;
  const availableAt = toIsoOrNull(product.availableAt);
  const upcoming = isUpcoming(availableAt);

  const displayVariants =
    preferredColorFamilies?.length
      ? variants.filter((v) => preferredColorFamilies.includes(v.colorFamily))
      : variants;
  const stockVariants = displayVariants.length > 0 ? displayVariants : variants;
  const cardVariant = pickCardVariant(variants, preferredColorFamilies);

  const priceFrom = stockVariants.length
    ? Math.min(...stockVariants.map((v) => v.price))
    : 0;

  const imageUrl =
    cardVariant?.imageUrl ??
    variants.find((v) => v.imageUrl)?.imageUrl ??
    null;

  const totalStock = stockVariants.reduce(
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
    variantId: cardVariant?.id ?? "",
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

  return products.map((product) => toProductCardData(product));
}

/** Fisher–Yates shuffle — fresh order on every request. */
function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = tmp;
  }
  return arr;
}

/**
 * Round-robin across brands after shuffling each brand's queue,
 * so home grids stay mixed and change on refresh.
 */
function diversifyByBrand(
  rows: ProductCardRow[],
  take: number,
): ProductCardRow[] {
  const queues = new Map<string, ProductCardRow[]>();
  for (const row of shuffle(rows)) {
    const key = row.brand.name;
    const list = queues.get(key);
    if (list) list.push(row);
    else queues.set(key, [row]);
  }

  const brandQueues = shuffle([...queues.values()].map((queue) => shuffle(queue)));
  const picked: ProductCardRow[] = [];
  let guard = 0;

  while (
    picked.length < take &&
    brandQueues.some((queue) => queue.length > 0) &&
    guard < take * brandQueues.length + 1
  ) {
    for (const queue of brandQueues) {
      if (picked.length >= take) break;
      const next = queue.shift();
      if (next) picked.push(next);
    }
    guard++;
  }

  return shuffle(picked);
}

function availableNowWhere(now = new Date()): Prisma.ProductWhereInput {
  return {
    OR: [{ availableAt: null }, { availableAt: { lte: now } }],
  };
}

export type HomeProductRails = {
  newDrops: ProductCardData[];
  featured: ProductCardData[];
  browseAll: ProductCardData[];
};

/**
 * Homepage product rails — randomized each request, distinct intents, no overlap:
 * - New Drops → badge "new"
 * - Featured → featured flag (topped up with limited if needed)
 * - Browse All → brand-mixed catalog sampler
 *
 * Wrapped in `cache()` so multiple home sections share one fetch per request.
 */
export const getHomeProductRails = cache(
  async (): Promise<HomeProductRails> => {
    const now = new Date();
    const available = availableNowWhere(now);

    const newDropPool = await prisma.product.findMany({
      where: { badge: "new", AND: [available] },
      select: productCardSelect,
    });
    const newDropRows = diversifyByBrand(newDropPool, 12);
    const newDropIds = newDropRows.map((row) => row.id);

    const featuredExclude = newDropIds;
    const featuredPool = await prisma.product.findMany({
      where: {
        featured: true,
        ...(featuredExclude.length > 0
          ? { id: { notIn: featuredExclude } }
          : {}),
        AND: [available],
      },
      select: productCardSelect,
    });
    let featuredRows = diversifyByBrand(featuredPool, 12);

    if (featuredRows.length < 12) {
      const need = 12 - featuredRows.length;
      const topUpExclude = [
        ...newDropIds,
        ...featuredRows.map((row) => row.id),
      ];
      const topUpPool = await prisma.product.findMany({
        where: {
          badge: "limited",
          ...(topUpExclude.length > 0
            ? { id: { notIn: topUpExclude } }
            : {}),
          AND: [available],
        },
        select: productCardSelect,
      });
      featuredRows = shuffle([
        ...featuredRows,
        ...diversifyByBrand(topUpPool, need),
      ]);
    }

    const excludeIds = [
      ...newDropIds,
      ...featuredRows.map((row) => row.id),
    ];

    const browsePool = await prisma.product.findMany({
      where: {
        ...(excludeIds.length > 0 ? { id: { notIn: excludeIds } } : {}),
        AND: [available],
      },
      select: productCardSelect,
    });
    const browseRows = diversifyByBrand(browsePool, 18);

    return {
      newDrops: newDropRows.map((product) => toProductCardData(product)),
      featured: featuredRows.map((product) => toProductCardData(product)),
      browseAll: browseRows.map((product) => toProductCardData(product)),
    };
  },
);

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
      description: true,
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
      description: variant.description,
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
 * Cards for a "you might also like" rail:
 * 1. Prefer same category (lifestyle / running / basketball / skate)
 * 2. Shuffle + diversify brands so the rail feels fresh per visit
 * 3. Top up from other categories only if the pool is thin
 */
export async function getRelatedProducts(
  slug: string,
  category: ProductCategory,
  take = 4,
): Promise<ProductCardData[]> {
  // Opt this page into dynamic rendering so shuffle isn't frozen at build time.
  const { connection } = await import("next/server");
  await connection();

  const poolSize = Math.max(take * 8, 24);

  const sameCategory = await prisma.product.findMany({
    where: { slug: { not: slug }, category },
    take: poolSize,
    orderBy: { createdAt: "desc" },
    select: productCardSelect,
  });

  let rows = diversifyByBrand(shuffle(sameCategory), take);

  if (rows.length < take) {
    const excludeSlugs = [slug, ...rows.map((r) => r.slug)];
    const filler = await prisma.product.findMany({
      where: { slug: { notIn: excludeSlugs } },
      take: poolSize,
      orderBy: { createdAt: "desc" },
      select: productCardSelect,
    });
    rows = [
      ...rows,
      ...diversifyByBrand(shuffle(filler), take - rows.length),
    ];
  }

  return rows.map((product) => toProductCardData(product));
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

/** Classic GR models used as hero images on the /brands grid. */
const BRAND_CARD_PRODUCT_SLUGS: Record<string, string> = {
  nike: "nike-air-force-1-low",
  adidas: "adidas-samba-og",
  "new-balance": "new-balance-550",
  asics: "asics-gel-kayano-14",
  puma: "puma-suede-classic",
  converse: "converse-chuck-70-hi",
};

/** All brands with product counts and a classic product image (for /brands grid). */
export async function getBrands(): Promise<BrandCard[]> {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    select: {
      name: true,
      slug: true,
      _count: { select: { products: true } },
    },
  });

  const preferredSlugs = Object.values(BRAND_CARD_PRODUCT_SLUGS);
  const preferredProducts = await prisma.product.findMany({
    where: { slug: { in: preferredSlugs } },
    select: {
      slug: true,
      brand: { select: { slug: true } },
      variants: {
        take: 1,
        orderBy: { createdAt: "asc" },
        select: { imageUrl: true },
      },
    },
  });

  const imageByBrand = new Map(
    preferredProducts.map((product) => [
      product.brand.slug,
      product.variants[0]?.imageUrl ?? null,
    ]),
  );

  // Fallback: newest product image for any brand without a classic pick.
  const missingSlugs = brands
    .map((b) => b.slug)
    .filter((slug) => !imageByBrand.get(slug));

  if (missingSlugs.length > 0) {
    const fallbacks = await prisma.brand.findMany({
      where: { slug: { in: missingSlugs } },
      select: {
        slug: true,
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
    for (const brand of fallbacks) {
      imageByBrand.set(
        brand.slug,
        brand.products[0]?.variants[0]?.imageUrl ?? null,
      );
    }
  }

  return brands.map((brand) => ({
    slug: brand.slug,
    name: brand.name,
    productCount: brand._count.products,
    imageUrl: imageByBrand.get(brand.slug) ?? null,
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
  /** Free-text search (name, slug, brand, colourway). */
  q?: string;
  priceMin?: number;
  priceMax?: number;
  /** When false (default), products with zero total stock are hidden. */
  includeOutOfStock?: boolean;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
};

function textSearchWhere(q: string): Prisma.ProductWhereInput {
  return {
    OR: [
      { name: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
      { brand: { name: { contains: q, mode: "insensitive" } } },
      { variants: { some: { color: { contains: q, mode: "insensitive" } } } },
    ],
  };
}

/** Lightweight product hits for the navbar live-search overlay. */
export async function searchProducts(
  q: string,
  take = 8,
): Promise<ProductCardData[]> {
  const query = q.trim().replace(/\s+/g, " ");
  if (query.length < 2) return [];

  // Include upcoming drops (availableAt in the future) so colourway searches
  // like "Infrared" still surface poster / calendar products.
  const rows = await prisma.product.findMany({
    where: {
      AND: [
        { variants: { some: { sizes: { some: { stock: { gt: 0 } } } } } },
        textSearchWhere(query),
      ],
    },
    orderBy: { createdAt: "desc" },
    take,
    select: productCardSelect,
  });

  return rows.map((row) => toProductCardData(row));
}

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
    q,
    priceMin,
    priceMax,
    includeOutOfStock = false,
    sort = "newest",
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
  } = options;

  const base = collectionWhere(collection);
  const and: Prisma.ProductWhereInput[] = [];

  // Men / women normally include unisex. When a size outside that gender's
  // run is selected (e.g. men + EU 38), drop unisex so women's/shared sizes
  // don't leak into the men's results.
  if (gender === "men") {
    and.push({
      gender: sizesFitGender("men", sizeFilters)
        ? { in: ["men", "unisex"] }
        : "men",
    });
  } else if (gender === "women") {
    and.push({
      gender: sizesFitGender("women", sizeFilters)
        ? { in: ["women", "unisex"] }
        : "women",
    });
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
  const query = q?.trim().replace(/\s+/g, " ") ?? "";
  if (query.length >= 2) {
    and.push(textSearchWhere(query));
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

  let products = rows.map((row) => toProductCardData(row, colors));

  if (sort === "price-asc") {
    products = products.sort((a, b) => a.priceFrom - b.priceFrom);
  } else if (sort === "price-desc") {
    products = products.sort((a, b) => b.priceFrom - a.priceFrom);
  } else {
    // Default "newest": seed inserts brand-by-brand, so createdAt clusters
    // by brand. Round-robin keeps the grid mixed while staying stable for pagination.
    products = interleaveByBrand(products);
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
