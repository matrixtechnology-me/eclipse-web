-- Renomear colunas ao invés de dropar diretamente (mantém dados)
-- Etapa 1: Criar as novas colunas auxiliares
ALTER TABLE "product_specification"
ADD COLUMN "created_at" TIMESTAMP(3),
ADD COLUMN "updated_at" TIMESTAMP(3);

ALTER TABLE "products"
ADD COLUMN "created_at" TIMESTAMP(3),
ADD COLUMN "updated_at" TIMESTAMP(3),
ADD COLUMN "tenant_id" UUID,
ADD COLUMN "category_id" UUID;

-- Etapa 2: Copiar os dados das colunas antigas para as novas
UPDATE "product_specification"
SET
  "created_at" = "createdAt",
  "updated_at" = "updatedAt";

UPDATE "products"
SET
  "created_at" = "createdAt",
  "updated_at" = "updatedAt",
  "tenant_id" = "tenantId";

-- Etapa 3: Dropar as colunas antigas (somente após garantir a cópia)
ALTER TABLE "product_specification"
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

ALTER TABLE "products"
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
DROP COLUMN "tenantId";

-- Etapa 4: Marcar as novas colunas como NOT NULL se necessário
ALTER TABLE "product_specification"
ALTER COLUMN "created_at"
SET
  NOT NULL,
ALTER COLUMN "updated_at"
SET
  NOT NULL;

ALTER TABLE "products"
ALTER COLUMN "created_at"
SET
  NOT NULL,
ALTER COLUMN "updated_at"
SET
  NOT NULL,
ALTER COLUMN "tenant_id"
SET
  NOT NULL;

-- Etapa 5: Recriar os relacionamentos
CREATE TABLE
  "product_categories" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("id")
  );

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE;