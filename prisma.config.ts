import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Use process.env (not env()) so `prisma generate` works when DATABASE_URL
    // is only needed later for migrate/seed — e.g. Vercel install/build.
    url: process.env.DATABASE_URL!,
  },
});
