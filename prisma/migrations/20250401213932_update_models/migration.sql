/*
Warnings:

- Added the required column `total` to the `sales` table without a default value. This is not possible if the table is not empty.

 */
-- AlterTable
ALTER TABLE "sales"
ADD COLUMN "total" DECIMAL(65, 30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "users"
ADD COLUMN "active" BOOLEAN NOT NULL DEFAULT true;