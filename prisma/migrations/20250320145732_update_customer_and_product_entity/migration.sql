-- Renomear a tabela "Customer" para "customers"
ALTER TABLE "Customer"
RENAME TO "customers";

-- Renomear a constraint da chave estrangeira (se necessário)
ALTER TABLE "receivables"
DROP CONSTRAINT "receivables_customerId_fkey",
ADD CONSTRAINT "receivables_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Alterar colunas na tabela renomeada para corresponder à nova estrutura
ALTER TABLE "customers"
ALTER COLUMN "name"
SET DEFAULT '',
ALTER COLUMN "active"
SET DEFAULT true,
ALTER COLUMN "created_at"
SET DEFAULT CURRENT_TIMESTAMP;