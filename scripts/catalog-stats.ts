import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const [
    productTotal,
    variantTotal,
    byGender,
    byBrand,
    byColor,
    byCategory,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.productVariant.count(),
    prisma.product.groupBy({
      by: ["gender"],
      _count: { _all: true },
      orderBy: { gender: "asc" },
    }),
    prisma.product.groupBy({
      by: ["brandId"],
      _count: { _all: true },
      orderBy: { _count: { brandId: "desc" } },
    }),
    prisma.productVariant.groupBy({
      by: ["colorFamily"],
      _count: { _all: true },
      orderBy: { _count: { colorFamily: "desc" } },
    }),
    prisma.product.groupBy({
      by: ["category"],
      _count: { _all: true },
      orderBy: { _count: { category: "desc" } },
    }),
  ]);

  const brands = await prisma.brand.findMany({
    select: { id: true, name: true },
  });
  const brandName = new Map(brands.map((b) => [b.id, b.name]));

  console.log(
    JSON.stringify(
      {
        totals: {
          products: productTotal,
          variants: variantTotal,
          brands: brands.length,
        },
        gender: byGender.map((g) => ({
          gender: g.gender,
          products: g._count._all,
        })),
        brands: byBrand.map((b) => ({
          brand: brandName.get(b.brandId) ?? b.brandId,
          products: b._count._all,
        })),
        colors: byColor.map((c) => ({
          color: c.colorFamily,
          variants: c._count._all,
        })),
        categories: byCategory.map((c) => ({
          category: c.category,
          products: c._count._all,
        })),
      },
      null,
      2,
    ),
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
