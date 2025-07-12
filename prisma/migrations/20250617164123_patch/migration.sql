-- CreateEnum
CREATE TYPE "UnitOfMeasure" AS ENUM (
  'unit',
  'kilogram',
  'gram',
  'liter',
  'milliliter',
  'meter',
  'centimeter',
  'square_meter',
  'cubic_meter'
);

-- AlterTable
ALTER TABLE "product_compositions"
ADD COLUMN "total_qty" DECIMAL(10, 2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "products"
ADD COLUMN "unit_of_measure" "UnitOfMeasure" NOT NULL DEFAULT 'unit';