-- AlterTable
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "available_at" TIMESTAMP(3);
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "hero_image_url" TEXT;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "products_available_at_idx" ON "products"("available_at");
