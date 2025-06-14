/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `files` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[key]` on the table `folders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `key` to the `folders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "folders" ADD COLUMN     "key" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "files_key_key" ON "files"("key");

-- CreateIndex
CREATE UNIQUE INDEX "folders_key_key" ON "folders"("key");
