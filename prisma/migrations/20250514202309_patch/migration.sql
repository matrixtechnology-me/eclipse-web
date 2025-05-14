/*
Warnings:

- You are about to drop the column `sku_id` on the `stocks` table. All the data in the column will be lost.
- A unique constraint covering the columns `[product_id]` on the table `stocks` will be added. If there are existing duplicate values, this will fail.
- Added the required column `product_id` to the `stocks` table without a default value. This is not possible if the table is not empty.

 */
-- DropForeignKey
-- 1. Adiciona a nova coluna, sem NOT NULL ainda
ALTER TABLE "stocks"
ADD COLUMN "product_id" UUID;

-- 2. Copia os valores da coluna antiga para a nova
UPDATE "stocks"
SET
  "product_id" = "sku_id";

-- 3. Define a nova coluna como NOT NULL
ALTER TABLE "stocks"
ALTER COLUMN "product_id"
SET
  NOT NULL;

-- 4. Remove a foreign key antiga e a coluna antiga
ALTER TABLE "stocks"
DROP CONSTRAINT "stocks_sku_id_fkey";

DROP INDEX "stocks_sku_id_key";

ALTER TABLE "stocks"
DROP COLUMN "sku_id";

-- 5. Cria novo índice único e adiciona a nova foreign key
CREATE UNIQUE INDEX "stocks_product_id_key" ON "stocks" ("product_id");

ALTER TABLE "stocks" ADD CONSTRAINT "stocks_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;