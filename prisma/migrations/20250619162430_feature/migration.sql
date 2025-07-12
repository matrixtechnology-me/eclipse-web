-- CreateEnum
CREATE TYPE "ProductionType" AS ENUM ('own', 'outsourced');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "production_type" "ProductionType" NOT NULL DEFAULT 'outsourced';
