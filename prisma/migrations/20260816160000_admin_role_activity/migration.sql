-- Admin role, soft-archive, and activity audit log.
-- Safe to run on DBs that already applied these via `prisma db push`.

DO $$ BEGIN
  CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'ADMIN');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER';

ALTER TABLE "products"
  ADD COLUMN IF NOT EXISTS "archived" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS "admin_activities" (
  "id" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "entity_type" TEXT NOT NULL,
  "entity_id" TEXT,
  "message" TEXT NOT NULL,
  "meta" JSONB,
  "actor_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "admin_activities_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "admin_activities_created_at_idx" ON "admin_activities"("created_at");
CREATE INDEX IF NOT EXISTS "admin_activities_actor_id_idx" ON "admin_activities"("actor_id");
CREATE INDEX IF NOT EXISTS "products_archived_idx" ON "products"("archived");

DO $$ BEGIN
  ALTER TABLE "admin_activities"
    ADD CONSTRAINT "admin_activities_actor_id_fkey"
    FOREIGN KEY ("actor_id") REFERENCES "users"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
