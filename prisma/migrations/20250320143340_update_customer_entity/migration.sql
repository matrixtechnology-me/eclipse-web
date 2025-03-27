-- Cria a nova coluna 'name' antes de remover 'first_name' e 'last_name'
ALTER TABLE "Customer"
ADD COLUMN "name" TEXT NOT NULL DEFAULT '';

-- Atualiza 'name' com a junção de 'first_name' e 'last_name'
UPDATE "Customer"
SET
  "name" = TRIM("first_name" || ' ' || "last_name");

-- Remove as colunas antigas e adiciona a nova coluna 'active'
ALTER TABLE "Customer"
DROP COLUMN "first_name",
DROP COLUMN "last_name",
DROP COLUMN "status",
ADD COLUMN "active" BOOLEAN DEFAULT true;

-- Adiciona a nova coluna 'quantity' na tabela 'products'
ALTER TABLE "products"
ADD COLUMN "quantity" INTEGER NOT NULL DEFAULT 0;

-- Adiciona as chaves estrangeiras
ALTER TABLE "sale_products" ADD CONSTRAINT "sale_products_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "sales" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "sale_products" ADD CONSTRAINT "sale_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;