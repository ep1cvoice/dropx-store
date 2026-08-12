import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/** Ensure seed admin exists (admin@dropx.store / DropxSeed123!). */
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash("DropxSeed123!", 12);
  const user = await prisma.user.upsert({
    where: { email: "admin@dropx.store" },
    update: { role: "ADMIN", password },
    create: {
      email: "admin@dropx.store",
      name: "Dropx",
      lastName: "Admin",
      password,
      role: "ADMIN",
    },
    select: { email: true, role: true },
  });
  console.log("Admin ready:", user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
