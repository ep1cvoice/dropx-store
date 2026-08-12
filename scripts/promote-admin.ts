import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const email = process.argv[2]?.trim().toLowerCase();
const demote = process.argv.includes("--demote");

if (!email) {
  console.error(
    "Usage: npx tsx scripts/promote-admin.ts you@email.com [--demote]",
  );
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const role = demote ? "CUSTOMER" : "ADMIN";
  const user = await prisma.user.update({
    where: { email },
    data: { role },
    select: { email: true, role: true, name: true, lastName: true },
  });
  console.log(
    `${demote ? "Demoted" : "Promoted"}: ${user.email} → ${user.role}`,
  );
  console.log("Sign out and sign in again for the new role to apply in JWT.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
