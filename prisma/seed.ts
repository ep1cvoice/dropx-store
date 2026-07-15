import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const defaultPassword = await bcrypt.hash("DropxSeed123!", 12);

  const alice = await prisma.user.upsert({
    where: { email: "alice@dropx.store" },
    update: {},
    create: {
      email: "alice@dropx.store",
      name: "Alice",
      lastName: "Doe",
      password: defaultPassword,
      products: {
        create: [
          {
            title: "Wireless Earbuds Pro",
            description: "High-quality wireless earbuds with noise cancellation",
            price: 49.99,
            imageUrl: "https://placehold.co/400x400?text=Earbuds",
          },
          {
            title: "Portable Charger 20000mAh",
            description: "Fast-charging power bank for all your devices",
            price: 29.99,
            imageUrl: "https://placehold.co/400x400?text=Charger",
          },
        ],
      },
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@dropx.store" },
    update: {},
    create: {
      email: "bob@dropx.store",
      name: "Bob",
      lastName: "Stone",
      password: defaultPassword,
      products: {
        create: [
          {
            title: "LED Desk Lamp",
            description: "Adjustable LED desk lamp with USB charging port",
            price: 24.99,
            imageUrl: "https://placehold.co/400x400?text=Lamp",
          },
        ],
      },
    },
  });

  console.log("Seeded:", { alice, bob });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
