/*
Warnings:

- You are about to drop the column `total` on the `sales` table. All the data in the column will be lost.
- Added the required column `estimated_total` to the `sales` table without a default value. This is not possible if the table is not empty.
- Added the required column `paid_total` to the `sales` table without a default value. This is not possible if the table is not empty.

 */
-- AlterTable
-- 1. Adiciona as novas colunas sem NOT NULL por enquanto
ALTER TABLE "sales"
ADD COLUMN "estimated_total" DECIMAL(19, 6),
ADD COLUMN "paid_total" DECIMAL(19, 6);

-- 2. Copia o valor da coluna antiga "total" para as novas colunas
UPDATE "sales"
SET
  "estimated_total" = "total",
  "paid_total" = "total";

-- 3. Altera as novas colunas para NOT NULL após migração
ALTER TABLE "sales"
ALTER COLUMN "estimated_total"
SET
  NOT NULL,
ALTER COLUMN "paid_total"
SET
  NOT NULL;

-- 4. Remove a coluna antiga
ALTER TABLE "sales"
DROP COLUMN "total";