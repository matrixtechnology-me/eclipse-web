/*
Warnings:

- You are about to drop the column `product_variant_id` on the `product_specification` table. All the data in the column will be lost.
- You are about to drop the column `product_id` on the `product_variations` table. All the data in the column will be lost.
- You are about to drop the column `sku_id` on the `sale_products` table. All the data in the column will be lost.
- You are about to drop the `products` table. If the table is not empty, all the data it contains will be lost.
- Added the required column `product_id` to the `product_specification` table without a default value. This is not possible if the table is not empty.
- Added the required column `bar_code` to the `product_variations` table without a default value. This is not possible if the table is not empty.
- Added the required column `name` to the `product_variations` table without a default value. This is not possible if the table is not empty.
- Added the required column `tenantId` to the `product_variations` table without a default value. This is not possible if the table is not empty.
- Made the column `description` on table `sale_products` required. This step will fail if there are existing NULL values in that column.

 */
-- DropForeignKey
ALTER TABLE "product_specification"
DROP CONSTRAINT "product_specification_product_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "product_variations"
DROP CONSTRAINT "product_variations_product_id_fkey";

-- DropForeignKey
ALTER TABLE "products"
DROP CONSTRAINT "products_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "sale_products"
DROP CONSTRAINT "sale_products_product_id_fkey";

-- DropForeignKey
ALTER TABLE "sale_products"
DROP CONSTRAINT "sale_products_sku_id_fkey";

-- AlterTable
ALTER TABLE "product_specification"
ADD COLUMN "product_id" UUID;

UPDATE "product_specification"
SET
  "product_id" = (
    SELECT
      "product_id"
    FROM
      "product_variations"
    WHERE
      "product_variations"."id" = "product_specification"."product_variant_id"
  );

ALTER TABLE "product_specification"
ALTER COLUMN "product_id"
SET
  NOT NULL;

ALTER TABLE "product_specification"
DROP COLUMN "product_variant_id";

-- AlterTable
ALTER TABLE "product_variations"
DROP COLUMN "product_id",
ADD COLUMN "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "bar_code" TEXT NOT NULL,
ADD COLUMN "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN "name" TEXT NOT NULL,
ADD COLUMN "tenantId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "sale_products"
DROP COLUMN "sku_id",
ALTER COLUMN "description"
SET
  NOT NULL;

-- DropTable
DROP TABLE "products";

-- AddForeignKey
ALTER TABLE "product_specification" ADD CONSTRAINT "product_specification_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product_variations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variations" ADD CONSTRAINT "product_variations_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale_products" ADD CONSTRAINT "sale_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product_variations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;