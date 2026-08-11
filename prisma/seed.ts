import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

import {
  BRANDS,
  CLASSICS,
  DROPS,
  img,
  resolveVariantStock,
  type SeedProduct,
  type SeedVariant,
} from "./seed/index";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

/** Build a standard EU size run with the given per-size stock counts. */
function sizes(stockByEu: Record<number, number>) {
  return Object.entries(stockByEu).map(([eu, stock]) => ({
    size: `EU ${eu}`,
    stock,
  }));
}

function variantImageUrl(variant: SeedVariant): string {
  if (variant.cloudinaryId) {
    const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
    if (cloud && !cloud.includes("://")) {
      return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto/${variant.cloudinaryId}`;
    }
  }
  if (variant.imageUrl) return variant.imageUrl;
  return img(variant.image);
}

async function createProduct(
  product: SeedProduct,
  brandId: string,
  kind: "classic" | "drop",
) {
  await prisma.product.create({
    data: {
      slug: product.slug,
      name: product.name,
      description: product.description,
      category: product.category,
      gender: product.gender,
      badge: product.badge ?? undefined,
      discountValue: product.discountValue ?? undefined,
      featured: product.featured ?? false,
      availableAt: product.availableAt
        ? new Date(product.availableAt)
        : undefined,
      heroImageUrl: product.heroImageUrl ?? undefined,
      currency: "EUR",
      brandId,
      variants: {
        create: product.variants.map((variant) => ({
          color: variant.color,
          colorHex: variant.colorHex,
          colorFamily: variant.colorFamily,
          description: variant.description ?? undefined,
          price: variant.price,
          imageUrl: variantImageUrl(variant),
          sizes: {
            create: sizes(resolveVariantStock(product, variant, kind)),
          },
        })),
      },
    },
  });
}

async function main() {
  const defaultPassword = await bcrypt.hash("DropxSeed123!", 12);

  await prisma.user.upsert({
    where: { email: "alice@dropx.store" },
    update: {},
    create: {
      email: "alice@dropx.store",
      name: "Alice",
      lastName: "Doe",
      password: defaultPassword,
    },
  });

  await prisma.user.upsert({
    where: { email: "bob@dropx.store" },
    update: {},
    create: {
      email: "bob@dropx.store",
      name: "Bob",
      lastName: "Stone",
      password: defaultPassword,
    },
  });

  // Reset catalog (children first to satisfy FKs)
  await prisma.productReview.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.variantSize.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();

  const brandByName = new Map<string, string>();
  for (const brand of BRANDS) {
    const created = await prisma.brand.create({ data: { ...brand } });
    brandByName.set(brand.name, created.id);
  }

  // Classics first (older createdAt), then drops — newest drops surface in New Drops.
  for (const product of CLASSICS) {
    const brandId = brandByName.get(product.brand);
    if (!brandId) throw new Error(`Unknown brand: ${product.brand}`);
    await createProduct(product, brandId, "classic");
  }
  for (const product of DROPS) {
    const brandId = brandByName.get(product.brand);
    if (!brandId) throw new Error(`Unknown brand: ${product.brand}`);
    await createProduct(product, brandId, "drop");
  }

  // Fake reviewers + reviews on ~35% of products (portfolio-ready PDP).
  const REVIEWERS = [
    { email: "maya@dropx.store", name: "Maya", lastName: "Chen" },
    { email: "leo@dropx.store", name: "Leo", lastName: "Kowalski" },
    { email: "sofia@dropx.store", name: "Sofia", lastName: "Reyes" },
    { email: "noah@dropx.store", name: "Noah", lastName: "Berg" },
    { email: "ira@dropx.store", name: "Ira", lastName: "Novak" },
    { email: "elise@dropx.store", name: "Elise", lastName: "Moreau" },
    { email: "jake@dropx.store", name: "Jake", lastName: "Miller" },
    { email: "hana@dropx.store", name: "Hana", lastName: "Park" },
  ] as const;

  const REVIEW_BODIES = [
    "True to size and comfortable from day one. Great daily pair.",
    "Materials feel premium — colourway looks even better in person.",
    "Solid cushioning for city walks. Would buy again.",
    "Fit runs a touch snug; sized up half and they are perfect.",
    "Clean silhouette, easy to style. Shipping was quick too.",
    "Grip and support exceeded expectations for the price.",
    "Slight break-in needed, then they disappeared on foot.",
    "Exact what I wanted from this silhouette. Verified quality.",
  ];

  const reviewerIds: string[] = [];
  for (const reviewer of REVIEWERS) {
    const user = await prisma.user.upsert({
      where: { email: reviewer.email },
      update: { name: reviewer.name, lastName: reviewer.lastName },
      create: {
        email: reviewer.email,
        name: reviewer.name,
        lastName: reviewer.lastName,
        password: defaultPassword,
      },
    });
    reviewerIds.push(user.id);
  }

  const allProducts = await prisma.product.findMany({
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });

  // Deterministic ~33% coverage without Math.random (stable seed runs).
  const reviewProducts = allProducts.filter((_, i) => i % 3 === 0);
  let reviewCount = 0;

  for (let i = 0; i < reviewProducts.length; i++) {
    const product = reviewProducts[i]!;
    const reviewCountForProduct = 2 + (i % 4); // 2–5 reviews
    const usedReviewers = new Set<string>();

    for (let r = 0; r < reviewCountForProduct; r++) {
      const reviewerId = reviewerIds[(i + r * 3) % reviewerIds.length]!;
      if (usedReviewers.has(reviewerId)) continue;
      usedReviewers.add(reviewerId);

      const rating = ([5, 5, 4, 4, 5, 3, 4, 5] as const)[(i + r) % 8]!;
      const body = REVIEW_BODIES[(i + r) % REVIEW_BODIES.length]!;
      const daysAgo = 3 + ((i * 5 + r * 11) % 90);

      await prisma.productReview.create({
        data: {
          productId: product.id,
          userId: reviewerId,
          rating,
          body,
          verifiedPurchase: true,
          createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
        },
      });
      reviewCount += 1;
    }
  }

  const [brands, products, variants, sizeRows, upcoming, reviews] =
    await Promise.all([
      prisma.brand.count(),
      prisma.product.count(),
      prisma.productVariant.count(),
      prisma.variantSize.count(),
      prisma.product.count({ where: { availableAt: { not: null } } }),
      prisma.productReview.count(),
    ]);

  console.log("Seeded catalog:", {
    brands,
    products,
    variants,
    sizeRows,
    upcoming,
    classics: CLASSICS.length,
    drops: DROPS.length,
    reviewProducts: reviewProducts.length,
    reviews: reviewCount || reviews,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
