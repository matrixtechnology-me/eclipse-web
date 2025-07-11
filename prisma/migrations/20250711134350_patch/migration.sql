/*
  Warnings:

  - You are about to drop the column `cost_price` on the `pos_event_sale_products` table. All the data in the column will be lost.
  - You are about to drop the column `cost_price` on the `sale_products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "pos_event_sale_products" DROP COLUMN "cost_price";

-- AlterTable
ALTER TABLE "sale_products" DROP COLUMN "cost_price";
