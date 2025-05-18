-- Adiciona a coluna tenant_id à tabela product_categories
ALTER TABLE "product_categories"
ADD COLUMN "tenant_id" UUID NOT NULL;

-- Renomeia corretamente a constraint da tabela product_specifications
ALTER TABLE "product_specifications" RENAME CONSTRAINT "product_specification_pkey" TO "product_specifications_pkey";

-- Altera a coluna created_at para ter o valor padrão CURRENT_TIMESTAMP
ALTER TABLE "product_specifications"
ALTER COLUMN "created_at"
SET DEFAULT CURRENT_TIMESTAMP;