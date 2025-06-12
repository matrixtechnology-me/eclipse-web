/*
Warnings:

- Added the required column `category_id` to the `product_subcategories` table without a default value. This is not possible if the table is not empty.

 */
-- AlterTable
ALTER TABLE "product_subcategories"
ADD COLUMN "category_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "product_subcategories" ADD CONSTRAINT "product_subcategories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;