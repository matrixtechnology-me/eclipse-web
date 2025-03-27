/*
  Warnings:

  - Added the required column `quantity` to the `sale_products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_id` to the `sales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sale_products" ADD COLUMN     "quantity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "sales" ADD COLUMN     "customer_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
