-- AlterTable
ALTER TABLE "product_variants" ADD COLUMN     "colorFamily" TEXT NOT NULL DEFAULT 'multi';

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false;
