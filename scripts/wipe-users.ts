import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const before = await prisma.user.count();
  // Cascade on User already removes reviews/orders/cart/wishlist/sessions.
  // Explicit review delete is unnecessary but harmless if run first.
  const deleted = await prisma.user.deleteMany();
  const after = await prisma.user.count();
  const remainingReviews = await prisma.productReview.count();
  const remainingOrders = await prisma.order.count();

  console.log({
    usersBefore: before,
    usersDeleted: deleted.count,
    usersAfter: after,
    remainingReviews,
    remainingOrders,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
