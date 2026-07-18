import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Stable Unsplash sneaker photos (images.unsplash.com is allowlisted in next.config.ts).
const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

/** Build a standard EU size run with the given per-size stock counts. */
function sizes(stockByEu: Record<number, number>) {
  return Object.entries(stockByEu).map(([eu, stock]) => ({
    size: `EU ${eu}`,
    stock,
  }));
}

async function main() {
  // --- Users (no products; single-store catalog) ------------------------
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

  // --- Reset catalog (children first to satisfy FKs) --------------------
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.variantSize.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();

  // --- Brands -----------------------------------------------------------
  const [nike, adidas, newBalance, asics] = await Promise.all([
    prisma.brand.create({ data: { name: "Nike", slug: "nike" } }),
    prisma.brand.create({ data: { name: "Adidas", slug: "adidas" } }),
    prisma.brand.create({ data: { name: "New Balance", slug: "new-balance" } }),
    prisma.brand.create({ data: { name: "ASICS", slug: "asics" } }),
  ]);

  // --- Products (with nested variants + sizes) --------------------------
  await prisma.product.create({
    data: {
      slug: "air-jordan-1-retro-high-og",
      name: "Air Jordan 1 Retro High OG",
      category: "basketball",
      badge: "limited",
      currency: "EUR",
      brandId: nike.id,
      variants: {
        create: [
          {
            color: "Chicago",
            colorHex: "#C8102E",
            price: 189,
            imageUrl: img("photo-1552346154-21d32810aba3"),
            sizes: { create: sizes({ 40: 4, 41: 6, 42: 8, 43: 5, 44: 2, 45: 0 }) },
          },
          {
            color: "Royal Blue",
            colorHex: "#1D3C8E",
            price: 189,
            imageUrl: img("photo-1600185365483-26d7a4cc7519"),
            sizes: { create: sizes({ 41: 3, 42: 3, 43: 4, 44: 6, 45: 4 }) },
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      slug: "nike-dunk-low-panda",
      name: "Dunk Low 'Panda'",
      category: "lifestyle",
      badge: "new",
      currency: "EUR",
      brandId: nike.id,
      variants: {
        create: [
          {
            color: "Black / White",
            colorHex: "#1A1A1A",
            price: 119,
            imageUrl: img("photo-1595950653106-6c9ebd614d3a"),
            sizes: { create: sizes({ 39: 10, 40: 12, 41: 12, 42: 9, 43: 7, 44: 5 }) },
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      slug: "nike-air-max-90",
      name: "Air Max 90",
      category: "lifestyle",
      badge: "discount",
      discountValue: 20,
      currency: "EUR",
      brandId: nike.id,
      variants: {
        create: [
          {
            color: "Triple White",
            colorHex: "#F5F5F5",
            price: 139,
            imageUrl: img("photo-1600269452121-4f2416e55c28"),
            sizes: { create: sizes({ 40: 8, 41: 8, 42: 10, 43: 6, 44: 4 }) },
          },
          {
            color: "Infrared",
            colorHex: "#E85D2A",
            price: 149,
            imageUrl: img("photo-1542291026-7eec264c27ff"),
            sizes: { create: sizes({ 41: 2, 42: 3, 43: 1, 44: 0 }) },
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      slug: "yeezy-boost-350-v2-zebra",
      name: "Yeezy Boost 350 V2 'Zebra'",
      category: "lifestyle",
      badge: "limited",
      currency: "EUR",
      brandId: adidas.id,
      variants: {
        create: [
          {
            color: "Zebra",
            colorHex: "#EDEDED",
            price: 249,
            imageUrl: img("photo-1514989940723-e8e51635b782"),
            sizes: { create: sizes({ 40: 1, 41: 2, 42: 2, 43: 1, 44: 0, 45: 0 }) },
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      slug: "adidas-samba-og",
      name: "Samba OG",
      category: "lifestyle",
      badge: "new",
      currency: "EUR",
      brandId: adidas.id,
      variants: {
        create: [
          {
            color: "Cloud White",
            colorHex: "#FAFAFA",
            price: 110,
            imageUrl: img("photo-1606107557195-0e29a4b5b4aa"),
            sizes: { create: sizes({ 39: 9, 40: 11, 41: 10, 42: 8, 43: 6, 44: 3 }) },
          },
          {
            color: "Core Black",
            colorHex: "#111111",
            price: 110,
            imageUrl: img("photo-1608231387042-66d1773070a5"),
            sizes: { create: sizes({ 40: 5, 41: 7, 42: 7, 43: 5, 44: 2 }) },
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      slug: "new-balance-550-white-green",
      name: "550 'White Green'",
      category: "lifestyle",
      badge: "new",
      currency: "EUR",
      brandId: newBalance.id,
      variants: {
        create: [
          {
            color: "White / Green",
            colorHex: "#2E7D46",
            price: 139,
            imageUrl: img("photo-1549298916-b41d501d3772"),
            sizes: { create: sizes({ 40: 6, 41: 8, 42: 9, 43: 7, 44: 4, 45: 2 }) },
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      slug: "new-balance-9060",
      name: "9060",
      category: "running",
      badge: "discount",
      discountValue: 15,
      currency: "EUR",
      brandId: newBalance.id,
      variants: {
        create: [
          {
            color: "Rain Cloud",
            colorHex: "#8A8D91",
            price: 169,
            imageUrl: img("photo-1460353581641-37baddab0fa2"),
            sizes: { create: sizes({ 41: 4, 42: 6, 43: 6, 44: 3, 45: 1 }) },
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      slug: "asics-gel-1130",
      name: "GEL-1130",
      category: "running",
      badge: null,
      currency: "EUR",
      brandId: asics.id,
      variants: {
        create: [
          {
            color: "White / Clay Grey",
            colorHex: "#D9D2C7",
            price: 129,
            imageUrl: img("photo-1595341888016-a392ef81b7de"),
            sizes: { create: sizes({ 40: 7, 41: 9, 42: 8, 43: 6, 44: 4 }) },
          },
        ],
      },
    },
  });

  const [brands, products, variants, sizeRows] = await Promise.all([
    prisma.brand.count(),
    prisma.product.count(),
    prisma.productVariant.count(),
    prisma.variantSize.count(),
  ]);

  console.log("Seeded catalog:", { brands, products, variants, sizeRows });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
