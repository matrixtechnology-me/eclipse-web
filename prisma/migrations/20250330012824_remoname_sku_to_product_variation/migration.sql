/*
  Warnings:

  - You are about to drop the `SKU` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SKU" DROP CONSTRAINT "SKU_product_id_fkey";

-- DropForeignKey
ALTER TABLE "sale_products" DROP CONSTRAINT "sale_products_sku_id_fkey";

-- DropForeignKey
ALTER TABLE "stocks" DROP CONSTRAINT "stocks_sku_id_fkey";

-- DropTable
DROP TABLE "SKU";

-- CreateTable
CREATE TABLE "product_variations" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "sku_code" TEXT NOT NULL,
    "salePrice" DECIMAL(65,30) NOT NULL,
    "attributes" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_variations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_variations_sku_code_key" ON "product_variations"("sku_code");

-- AddForeignKey
ALTER TABLE "product_variations" ADD CONSTRAINT "product_variations_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocks" ADD CONSTRAINT "stocks_sku_id_fkey" FOREIGN KEY ("sku_id") REFERENCES "product_variations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale_products" ADD CONSTRAINT "sale_products_sku_id_fkey" FOREIGN KEY ("sku_id") REFERENCES "product_variations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
