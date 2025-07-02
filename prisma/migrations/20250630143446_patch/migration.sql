/*
  Warnings:

  - Added the required column `pos_event_sale_id` to the `pos_event_sale_products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "pos_event_sale_products" DROP CONSTRAINT "pos_event_sale_products_id_fkey";

-- AlterTable
ALTER TABLE "pos_event_sale_products" ADD COLUMN     "pos_event_sale_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "pos_event_sale_products" ADD CONSTRAINT "pos_event_sale_products_pos_event_sale_id_fkey" FOREIGN KEY ("pos_event_sale_id") REFERENCES "pos_event_sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
