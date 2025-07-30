/*
Warnings:

- You are about to drop the column `checksum` on the `sessions` table. All the data in the column will be lost.
- Added the required column `fingerprint` to the `sessions` table without a default value. This is not possible if the table is not empty.

 */
-- DropIndex
DROP INDEX "sessions_checksum_key";

-- AlterTable
ALTER TABLE "sessions"
DROP COLUMN "checksum",
ADD COLUMN "fingerprint" TEXT NOT NULL;