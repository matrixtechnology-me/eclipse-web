/*
Warnings:

- A unique constraint covering the columns `[internal_code]` on the table `sales` will be added. If there are existing duplicate values, this will fail.
- Added the required column `internal_code` to the `sales` table without a default value. This is not possible if the table is not empty.

 */
-- AlterTable
ALTER TABLE "sales"
ADD COLUMN "internal_code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "sales_internal_code_key" ON "sales" ("internal_code");