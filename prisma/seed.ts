import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Stable Unsplash sneaker photos (images.unsplash.com is allowlisted in next.config.ts).
const IMAGE_POOL = [
  "photo-1542291026-7eec264c27ff",
  "photo-1600185365483-26d7a4cc7519",
  "photo-1595950653106-6c9ebd614d3a",
  "photo-1606107557195-0e29a4b5b4aa",
  "photo-1608231387042-66d1773070a5",
  "photo-1552346154-21d32810aba3",
  "photo-1514989940723-e8e51635b782",
  "photo-1600269452121-4f2416e55c28",
  "photo-1549298916-b41d501d3772",
  "photo-1460353581641-37baddab0fa2",
  "photo-1595341888016-a392ef81b7de",
  "photo-1491553895911-0055eca6402d",
  "photo-1465453869711-7e174808ace9",
  "photo-1584735175315-9d5df23860e6",
  "photo-1539185441755-769473a23570",
];

const img = (idx: number) =>
  `https://images.unsplash.com/${IMAGE_POOL[idx % IMAGE_POOL.length]}?auto=format&fit=crop&w=800&q=80`;

/** Build a standard EU size run with the given per-size stock counts. */
function sizes(stockByEu: Record<number, number>) {
  return Object.entries(stockByEu).map(([eu, stock]) => ({
    size: `EU ${eu}`,
    stock,
  }));
}

type Category = "running" | "basketball" | "lifestyle" | "skateboarding";
type Badge = "new" | "limited" | "discount" | null;
type Gender = "men" | "women" | "unisex";

type SeedVariant = {
  color: string;
  colorHex: string;
  colorFamily: string;
  price: number;
  image: number;
  stock: Record<number, number>;
};

type SeedProduct = {
  slug: string;
  name: string;
  description: string;
  brand: string; // brand name
  category: Category;
  gender: Gender;
  badge: Badge;
  discountValue?: number;
  featured?: boolean;
  variants: SeedVariant[];
};

const BRANDS = [
  { name: "Nike", slug: "nike" },
  { name: "Adidas", slug: "adidas" },
  { name: "New Balance", slug: "new-balance" },
  { name: "ASICS", slug: "asics" },
  { name: "Puma", slug: "puma" },
  { name: "Converse", slug: "converse" },
];

const PRODUCTS: SeedProduct[] = [
  // --- Nike -------------------------------------------------------------
  {
    slug: "air-jordan-1-retro-high-og",
    name: "Air Jordan 1 Retro High OG",
    description:
      "The one that started it all. Premium leather, Air-Sole cushioning, and the original colour blocking collectors chase.",
    brand: "Nike",
    category: "basketball",
    gender: "men",
    badge: "limited",
    featured: true,
    variants: [
      { color: "Chicago", colorHex: "#C8102E", colorFamily: "red", price: 189, image: 5, stock: { 40: 4, 41: 6, 42: 8, 43: 5, 44: 2, 45: 0 } },
      { color: "Royal Blue", colorHex: "#1D3C8E", colorFamily: "blue", price: 189, image: 1, stock: { 41: 3, 42: 3, 43: 4, 44: 6, 45: 4 } },
    ],
  },
  {
    slug: "nike-dunk-low-panda",
    name: "Dunk Low 'Panda'",
    description:
      "A wardrobe essential. Crisp white leather with black overlays for a clean look that goes with everything.",
    brand: "Nike",
    category: "lifestyle",
    gender: "unisex",
    badge: "new",
    variants: [
      { color: "Black / White", colorHex: "#1A1A1A", colorFamily: "black", price: 119, image: 2, stock: { 39: 10, 40: 12, 41: 12, 42: 9, 43: 7, 44: 5 } },
    ],
  },
  {
    slug: "nike-air-max-90",
    name: "Air Max 90",
    description:
      "The Nike Air Max 90 stays true to its OG roots with the iconic Waffle sole, stitched overlays, and classic TPU accents.",
    brand: "Nike",
    category: "lifestyle",
    gender: "unisex",
    badge: "discount",
    discountValue: 20,
    variants: [
      { color: "Triple White", colorHex: "#F5F5F5", colorFamily: "white", price: 139, image: 7, stock: { 40: 8, 41: 8, 42: 10, 43: 6, 44: 4 } },
      { color: "Infrared", colorHex: "#E85D2A", colorFamily: "orange", price: 149, image: 0, stock: { 41: 2, 42: 3, 43: 1, 44: 0 } },
    ],
  },
  {
    slug: "nike-air-force-1-low",
    name: "Air Force 1 '07 Low",
    description:
      "An icon of clean. Full-grain leather, crisp stitching, and the pivot-point outsole that defined a generation.",
    brand: "Nike",
    category: "lifestyle",
    gender: "unisex",
    badge: "new",
    variants: [
      { color: "Triple White", colorHex: "#FFFFFF", colorFamily: "white", price: 119, image: 8, stock: { 38: 6, 39: 9, 40: 12, 41: 12, 42: 10, 43: 8, 44: 5 } },
    ],
  },
  {
    slug: "nike-p-6000",
    name: "P-6000",
    description:
      "Y2K running energy. A metallic, layered upper on a chunky retro runner sole for full early-2000s flavour.",
    brand: "Nike",
    category: "running",
    gender: "unisex",
    badge: null,
    variants: [
      { color: "Metallic Silver", colorHex: "#B8BCC2", colorFamily: "grey", price: 139, image: 11, stock: { 40: 5, 41: 7, 42: 6, 43: 4 } },
    ],
  },
  {
    slug: "nike-sb-dunk-low-green",
    name: "SB Dunk Low",
    description:
      "Built for the board. Zoom Air insole, padded tongue, and a grippy outsole in a heritage green makeover.",
    brand: "Nike",
    category: "skateboarding",
    gender: "men",
    badge: "limited",
    variants: [
      { color: "Pine Green", colorHex: "#2E7D46", colorFamily: "green", price: 129, image: 3, stock: { 41: 2, 42: 2, 43: 1, 44: 0 } },
    ],
  },

  // --- Adidas -----------------------------------------------------------
  {
    slug: "yeezy-boost-350-v2-zebra",
    name: "Yeezy Boost 350 V2 'Zebra'",
    description:
      "Instantly recognisable. Full-length Boost under a breathable Primeknit upper with the signature striped pattern.",
    brand: "Adidas",
    category: "lifestyle",
    gender: "men",
    badge: "limited",
    featured: true,
    variants: [
      { color: "Zebra", colorHex: "#EDEDED", colorFamily: "white", price: 249, image: 6, stock: { 40: 1, 41: 2, 42: 2, 43: 1, 44: 0, 45: 0 } },
    ],
  },
  {
    slug: "adidas-samba-og",
    name: "Samba OG",
    description:
      "A terrace classic reborn. Soft leather, suede T-toe, gum sole, and gold foil branding — timeless from pitch to pavement.",
    brand: "Adidas",
    category: "lifestyle",
    gender: "women",
    badge: "new",
    featured: true,
    variants: [
      { color: "Cloud White", colorHex: "#FAFAFA", colorFamily: "white", price: 110, image: 3, stock: { 39: 9, 40: 11, 41: 10, 42: 8, 43: 6, 44: 3 } },
      { color: "Core Black", colorHex: "#111111", colorFamily: "black", price: 110, image: 4, stock: { 40: 5, 41: 7, 42: 7, 43: 5, 44: 2 } },
    ],
  },
  {
    slug: "adidas-gazelle-indoor",
    name: "Gazelle Indoor",
    description:
      "Retro indoor style with a plush suede upper, contrast three stripes, and a low, grippy gum outsole.",
    brand: "Adidas",
    category: "lifestyle",
    gender: "women",
    badge: null,
    variants: [
      { color: "Blue Bird", colorHex: "#3B6FB5", colorFamily: "blue", price: 120, image: 1, stock: { 40: 4, 41: 6, 42: 6, 43: 5, 44: 3 } },
    ],
  },
  {
    slug: "adidas-campus-00s",
    name: "Campus 00s",
    description:
      "Bold, chunky, and unmistakably 2000s. Premium suede with oversized branding and a comfortable footbed.",
    brand: "Adidas",
    category: "lifestyle",
    gender: "women",
    badge: "discount",
    discountValue: 15,
    variants: [
      { color: "Core Black", colorHex: "#1A1A1A", colorFamily: "black", price: 115, image: 4, stock: { 40: 7, 41: 8, 42: 9, 43: 6, 44: 4 } },
    ],
  },
  {
    slug: "adidas-ultraboost-light",
    name: "Ultraboost Light",
    description:
      "The lightest Ultraboost yet. Responsive Light Boost, a supportive cage, and a Primeknit+ upper for daily miles.",
    brand: "Adidas",
    category: "running",
    gender: "men",
    badge: null,
    variants: [
      { color: "Core Black", colorHex: "#101010", colorFamily: "black", price: 189, image: 12, stock: { 41: 5, 42: 7, 43: 6, 44: 4, 45: 2 } },
    ],
  },

  // --- New Balance ------------------------------------------------------
  {
    slug: "new-balance-550-white-green",
    name: "550 'White Green'",
    description:
      "Retro hoops heritage. A clean leather upper with perforated details and just the right amount of colour.",
    brand: "New Balance",
    category: "lifestyle",
    gender: "unisex",
    badge: "new",
    variants: [
      { color: "White / Green", colorHex: "#2E7D46", colorFamily: "green", price: 139, image: 8, stock: { 40: 6, 41: 8, 42: 9, 43: 7, 44: 4, 45: 2 } },
    ],
  },
  {
    slug: "new-balance-9060",
    name: "9060",
    description:
      "A bold evolution of the 99X lineage. Wavy overlays over chunky ABZORB and SBS cushioning for a Y2K look.",
    brand: "New Balance",
    category: "running",
    gender: "unisex",
    badge: "discount",
    discountValue: 15,
    featured: true,
    variants: [
      { color: "Rain Cloud", colorHex: "#8A8D91", colorFamily: "grey", price: 169, image: 9, stock: { 41: 4, 42: 6, 43: 6, 44: 3, 45: 1 } },
    ],
  },
  {
    slug: "new-balance-2002r",
    name: "2002R 'Rain Cloud'",
    description:
      "Premium comfort in grey. Suede-and-mesh construction with N-ergy and ABZORB cushioning for all-day wear.",
    brand: "New Balance",
    category: "running",
    gender: "unisex",
    badge: null,
    variants: [
      { color: "Rain Cloud", colorHex: "#9CA3AF", colorFamily: "grey", price: 159, image: 9, stock: { 40: 5, 41: 7, 42: 8, 43: 6, 44: 3 } },
    ],
  },
  {
    slug: "new-balance-1906r",
    name: "1906R",
    description:
      "Futuristic early-2000s tech. Stability web, N-ergy heel, and a breathable mesh upper in a metallic finish.",
    brand: "New Balance",
    category: "running",
    gender: "men",
    badge: "limited",
    variants: [
      { color: "Silver Metallic", colorHex: "#C4C8CE", colorFamily: "grey", price: 175, image: 11, stock: { 41: 2, 42: 3, 43: 2, 44: 1 } },
    ],
  },

  // --- ASICS ------------------------------------------------------------
  {
    slug: "asics-gel-1130",
    name: "GEL-1130",
    description:
      "Early-2000s running DNA. A mesh-and-synthetic upper with rearfoot GEL in understated quiet-luxury tones.",
    brand: "ASICS",
    category: "running",
    gender: "unisex",
    badge: null,
    variants: [
      { color: "White / Clay Grey", colorHex: "#D9D2C7", colorFamily: "white", price: 129, image: 10, stock: { 40: 7, 41: 9, 42: 8, 43: 6, 44: 4 } },
    ],
  },
  {
    slug: "asics-gel-kayano-14",
    name: "GEL-Kayano 14",
    description:
      "The archival stability runner. Layered overlays, dual-density GEL, and a distinctly metallic silver upper.",
    brand: "ASICS",
    category: "running",
    gender: "men",
    badge: "discount",
    discountValue: 25,
    variants: [
      { color: "Silver / Black", colorHex: "#A9AEB4", colorFamily: "grey", price: 169, image: 11, stock: { 41: 3, 42: 4, 43: 3, 44: 2, 45: 1 } },
    ],
  },
  {
    slug: "asics-gel-nyc",
    name: "GEL-NYC",
    description:
      "A hybrid of two ASICS icons. Chunky, comfortable, and finished in a versatile graphite grey.",
    brand: "ASICS",
    category: "lifestyle",
    gender: "women",
    badge: "new",
    variants: [
      { color: "Graphite Grey", colorHex: "#6B7078", colorFamily: "grey", price: 159, image: 9, stock: { 40: 5, 41: 6, 42: 6, 43: 4, 44: 2 } },
    ],
  },

  // --- Puma -------------------------------------------------------------
  {
    slug: "puma-palermo-og",
    name: "Palermo OG",
    description:
      "A terrace icon revived. Soft suede, a T-toe overlay, and a gum sole in a fresh green colourway.",
    brand: "Puma",
    category: "lifestyle",
    gender: "women",
    badge: "new",
    variants: [
      { color: "White / Green", colorHex: "#3E8E5A", colorFamily: "green", price: 100, image: 3, stock: { 40: 6, 41: 8, 42: 7, 43: 5, 44: 3 } },
    ],
  },
  {
    slug: "puma-suede-xl",
    name: "Suede XL",
    description:
      "The classic Suede, supersized. A chunky sole and premium suede upper for an exaggerated retro stance.",
    brand: "Puma",
    category: "lifestyle",
    gender: "unisex",
    badge: "discount",
    discountValue: 30,
    variants: [
      { color: "Olive", colorHex: "#6B6B3A", colorFamily: "green", price: 99, image: 4, stock: { 40: 4, 41: 5, 42: 6, 43: 4, 44: 2 } },
    ],
  },
  {
    slug: "puma-mostro",
    name: "Mostro",
    description:
      "The spiky-soled cult classic returns. A minimal slip-on silhouette with a bold, aggressive outsole.",
    brand: "Puma",
    category: "lifestyle",
    gender: "men",
    badge: "limited",
    variants: [
      { color: "Black", colorHex: "#141414", colorFamily: "black", price: 130, image: 2, stock: { 41: 0, 42: 0, 43: 0, 44: 0 } },
    ],
  },

  // --- Converse ---------------------------------------------------------
  {
    slug: "converse-chuck-70-hi",
    name: "Chuck 70 Hi",
    description:
      "The premium Chuck. Higher rubber foxing, cushioned Ortholite footbed, and vintage canvas in true black.",
    brand: "Converse",
    category: "lifestyle",
    gender: "women",
    badge: null,
    variants: [
      { color: "Black", colorHex: "#1A1A1A", colorFamily: "black", price: 89, image: 2, stock: { 39: 8, 40: 10, 41: 9, 42: 7, 43: 5, 44: 3 } },
    ],
  },
  {
    slug: "converse-one-star-pro",
    name: "One Star Pro",
    description:
      "Skate-ready heritage. A durable suede upper, Lunarlon cushioning, and the signature single star.",
    brand: "Converse",
    category: "skateboarding",
    gender: "men",
    badge: "new",
    variants: [
      { color: "Navy", colorHex: "#22304A", colorFamily: "blue", price: 95, image: 1, stock: { 40: 5, 41: 6, 42: 6, 43: 4, 44: 2 } },
    ],
  },
  {
    slug: "converse-run-star-hike",
    name: "Run Star Hike Hi",
    description:
      "A Chuck on a jagged, chunky platform. Bold proportions with the classic canvas high-top up top.",
    brand: "Converse",
    category: "lifestyle",
    gender: "women",
    badge: "discount",
    discountValue: 20,
    variants: [
      { color: "White", colorHex: "#F2F2F2", colorFamily: "white", price: 110, image: 8, stock: { 39: 4, 40: 6, 41: 6, 42: 5, 43: 3 } },
    ],
  },
];

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
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.variantSize.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();

  // --- Brands -----------------------------------------------------------
  const brandByName = new Map<string, string>();
  for (const brand of BRANDS) {
    const created = await prisma.brand.create({ data: brand });
    brandByName.set(brand.name, created.id);
  }

  // --- Products ---------------------------------------------------------
  // Created sequentially so createdAt ordering is deterministic (top of the
  // PRODUCTS array = oldest, bottom = newest → "New Drops" reads bottom-up).
  for (const product of PRODUCTS) {
    const brandId = brandByName.get(product.brand);
    if (!brandId) throw new Error(`Unknown brand: ${product.brand}`);

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
        currency: "EUR",
        brandId,
        variants: {
          create: product.variants.map((variant) => ({
            color: variant.color,
            colorHex: variant.colorHex,
            colorFamily: variant.colorFamily,
            price: variant.price,
            imageUrl: img(variant.image),
            sizes: { create: sizes(variant.stock) },
          })),
        },
      },
    });
  }

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
