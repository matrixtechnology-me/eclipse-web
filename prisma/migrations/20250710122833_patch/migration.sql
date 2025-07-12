/*
  Warnings:

  - You are about to drop the column `stock_lot_id` on the `sale_products` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "sale_products" DROP CONSTRAINT "sale_products_stock_lot_id_fkey";

-- AlterTable
ALTER TABLE "sale_products" DROP COLUMN "stock_lot_id";

-- CreateTable
CREATE TABLE "stock_lot_usages" (
    "id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "stock_lot_id" UUID NOT NULL,
    "sale_product_id" UUID NOT NULL,

    CONSTRAINT "stock_lot_usages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "stock_lot_usages" ADD CONSTRAINT "stock_lot_usages_stock_lot_id_fkey" FOREIGN KEY ("stock_lot_id") REFERENCES "stock_lots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_lot_usages" ADD CONSTRAINT "stock_lot_usages_sale_product_id_fkey" FOREIGN KEY ("sale_product_id") REFERENCES "sale_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
