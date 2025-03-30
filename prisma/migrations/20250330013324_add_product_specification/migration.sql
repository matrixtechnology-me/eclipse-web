/*
  Warnings:

  - You are about to drop the column `attributes` on the `product_variations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "product_variations" DROP COLUMN "attributes";

-- CreateTable
CREATE TABLE "product_specification" (
    "id" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "product_variant_id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_specification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "product_specification" ADD CONSTRAINT "product_specification_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "product_variations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
