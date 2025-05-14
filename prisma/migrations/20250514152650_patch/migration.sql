-- AlterTable
ALTER TABLE "pos_events"
ADD COLUMN "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "sales"
ADD COLUMN "deleted_at" TIMESTAMP(3);