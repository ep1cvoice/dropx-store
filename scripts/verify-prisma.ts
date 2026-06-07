import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const userCount = await prisma.user.count();
  const productCount = await prisma.product.count();
  console.log(`✅ Connected. Users: ${userCount}, Products: ${productCount}`);
}

main()
  .catch((e) => {
    console.error("❌ Connection failed:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
