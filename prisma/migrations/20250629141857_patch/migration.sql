/*
Warnings:

- You are about to drop the column `category_id` on the `product_subcategories` table. All the data in the column will be lost.
- You are about to drop the column `salePrice` on the `products` table. All the data in the column will be lost.
- Added the required column `sale_price` to the `products` table without a default value. This is not possible if the table is not empty.

 */
-- DropForeignKey
ALTER TABLE "product_subcategories"
DROP CONSTRAINT "product_subcategories_category_id_fkey";

-- AlterTable
ALTER TABLE "product_subcategories"
DROP COLUMN "category_id";

-- AlterTable
ALTER TABLE "products"
RENAME COLUMN "salePrice" TO "sale_price";

-- CreateTable
CREATE TABLE
  "product_category_subcategories" (
    "category_id" UUID NOT NULL,
    "subcategory_id" UUID NOT NULL,
    CONSTRAINT "product_category_subcategories_pkey" PRIMARY KEY ("category_id", "subcategory_id")
  );

-- AddForeignKey
ALTER TABLE "product_category_subcategories" ADD CONSTRAINT "product_category_subcategories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_category_subcategories" ADD CONSTRAINT "product_category_subcategories_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "product_subcategories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;