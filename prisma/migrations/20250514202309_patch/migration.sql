/*
Warnings:

- You are about to drop the column `sku_id` on the `stocks` table. All the data in the column will be lost.
- A unique constraint covering the columns `[product_id]` on the table `stocks` will be added. If there are existing duplicate values, this will fail.
- Added the required column `product_id` to the `stocks` table without a default value. This is not possible if the table is not empty.

 */
-- DropForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'stocks' AND column_name = 'product_id'
  ) THEN
    ALTER TABLE "stocks"
    ADD COLUMN "product_id" UUID;
  END IF;
END $$;

-- 2. Copia os valores de "sku_id" para "product_id", apenas se "sku_id" existir
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'stocks' AND column_name = 'sku_id'
  ) THEN
    UPDATE "stocks"
    SET
      "product_id" = "sku_id"
    WHERE
      "product_id" IS NULL;
  END IF;
END $$;

-- 3. Define a nova coluna "product_id" como NOT NULL, caso ela permita nulos
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'stocks'
      AND column_name = 'product_id'
      AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE "stocks"
    ALTER COLUMN "product_id" SET NOT NULL;
  END IF;
END $$;

-- 4. Remove a foreign key antiga e a coluna "sku_id", se existirem
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_name = 'stocks'
      AND constraint_name = 'stocks_sku_id_fkey'
  ) THEN
    ALTER TABLE "stocks" DROP CONSTRAINT "stocks_sku_id_fkey";
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE tablename = 'stocks'
      AND indexname = 'stocks_sku_id_key'
  ) THEN
    DROP INDEX "stocks_sku_id_key";
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'stocks' AND column_name = 'sku_id'
  ) THEN
    ALTER TABLE "stocks" DROP COLUMN "sku_id";
  END IF;
END $$;

-- 5. Cria um novo índice único para "product_id", caso ele ainda não exista
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE tablename = 'stocks'
      AND indexname = 'stocks_product_id_key'
  ) THEN
    CREATE UNIQUE INDEX "stocks_product_id_key" ON "stocks" ("product_id");
  END IF;
END $$;

-- 6. Adiciona a nova foreign key para "product_id", se ainda não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_name = 'stocks'
      AND constraint_name = 'stocks_product_id_fkey'
  ) THEN
    ALTER TABLE "stocks"
    ADD CONSTRAINT "stocks_product_id_fkey"
    FOREIGN KEY ("product_id") REFERENCES "products" ("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;