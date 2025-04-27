/*
  Warnings:

  - Added the required column `sale_id` to the `pos_event_sales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pos_event_sales" ADD COLUMN     "sale_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "pos_event_sales" ADD CONSTRAINT "pos_event_sales_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos_event_sales" ADD CONSTRAINT "pos_event_sales_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
