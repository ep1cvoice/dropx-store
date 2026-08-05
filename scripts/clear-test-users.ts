import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const KEEP = ["alice@dropx.store", "bob@dropx.store"] as const;

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const before = await prisma.user.findMany({
    select: { email: true },
    orderBy: { email: "asc" },
  });
  const toDelete = before.filter((u) => !KEEP.includes(u.email as (typeof KEEP)[number]));
  console.log("Deleting:", toDelete.map((u) => u.email));

  const result = await prisma.user.deleteMany({
    where: { email: { notIn: [...KEEP] } },
  });
  console.log("Deleted count:", result.count);

  const after = await prisma.user.findMany({
    select: { email: true },
    orderBy: { email: "asc" },
  });
  console.log("Remaining:", after.map((u) => u.email));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
