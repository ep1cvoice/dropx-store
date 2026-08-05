import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const users = await prisma.user.findMany({
    select: { email: true, name: true, lastName: true, password: true },
    orderBy: { email: "asc" },
  });
  console.log(
    JSON.stringify(
      users.map((u) => ({
        email: u.email,
        name: `${u.name} ${u.lastName}`.trim(),
        hasPassword: Boolean(u.password),
      })),
      null,
      2,
    ),
  );
  console.log(`Total: ${users.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
