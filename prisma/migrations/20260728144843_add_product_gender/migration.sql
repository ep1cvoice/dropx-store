-- CreateEnum
CREATE TYPE "ProductGender" AS ENUM ('men', 'women', 'unisex');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "gender" "ProductGender" NOT NULL DEFAULT 'unisex';

-- CreateIndex
CREATE INDEX "products_gender_idx" ON "products"("gender");
