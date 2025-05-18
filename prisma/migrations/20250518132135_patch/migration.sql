-- AlterTable
ALTER TABLE "products"
ALTER COLUMN "created_at"
SET DEFAULT CURRENT_TIMESTAMP;

-- Rename table
ALTER TABLE "product_specification"
RENAME TO "product_specifications";

-- Rename constraint (opcional, mas recomendado para consistência)
ALTER TABLE "product_specifications" RENAME CONSTRAINT "product_specification_product_id_fkey" TO "product_specifications_product_id_fkey";