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

  const [brands, products, variants, sizeRows, upcoming] = await Promise.all([
    prisma.brand.count(),
    prisma.product.count(),
    prisma.productVariant.count(),
    prisma.variantSize.count(),
    prisma.product.count({ where: { availableAt: { not: null } } }),
  ]);

  console.log("Seeded catalog:", {
    brands,
    products,
    variants,
    sizeRows,
    upcoming,
    classics: CLASSICS.length,
    drops: DROPS.length,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
