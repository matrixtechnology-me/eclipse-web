/*
Warnings:

- Changed the type of `user_id` on the `memberships` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

 */
-- AlterTable
-- 1. Adiciona uma coluna temporária para armazenar os valores atuais
ALTER TABLE "memberships"
ADD COLUMN "user_id_temp" TEXT;

-- 2. Copia os dados da coluna original para a temporária
UPDATE "memberships"
SET "user_id_temp" = "user_id";

-- 3. Remove a coluna original
ALTER TABLE "memberships"
DROP COLUMN "user_id";

-- 4. Adiciona a nova coluna com tipo UUID e restrição NOT NULL
ALTER TABLE "memberships"
ADD COLUMN "user_id" UUID;

-- 5. Converte e copia os dados da temporária para a nova coluna
UPDATE "memberships"
SET "user_id" = "user_id_temp"::UUID;

-- 6. Define a coluna como NOT NULL após a migração dos dados
ALTER TABLE "memberships"
ALTER COLUMN "user_id" SET NOT NULL;

-- 7. Remove a coluna temporária
ALTER TABLE "memberships"
DROP COLUMN "user_id_temp";

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;