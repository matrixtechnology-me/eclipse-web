/*
  Warnings:

  - You are about to drop the column `read` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_id` on the `notifications` table. All the data in the column will be lost.
  - The `type` column on the `notifications` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `amount` on the `pos_event_entries` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(19,6)`.
  - You are about to alter the column `amount` on the `pos_event_outputs` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(19,6)`.
  - You are about to alter the column `cost_price` on the `pos_event_sale_products` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(19,6)`.
  - You are about to alter the column `sale_price` on the `pos_event_sale_products` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(19,6)`.
  - You are about to alter the column `amount` on the `pos_event_sales` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(19,6)`.
  - You are about to alter the column `salePrice` on the `products` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(19,6)`.
  - You are about to alter the column `amount` on the `sale_movement_payments` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(19,6)`.
  - The primary key for the `sale_movements` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `saleId` on the `sale_movements` table. All the data in the column will be lost.
  - You are about to alter the column `cost_price` on the `sale_products` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(19,6)`.
  - You are about to alter the column `sale_price` on the `sale_products` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(19,6)`.
  - The `status` column on the `sales` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `total` on the `sales` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(19,6)`.
  - You are about to alter the column `cost_price` on the `stock_lots` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(19,6)`.
  - A unique constraint covering the columns `[bar_code]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[internal_code]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `deleted_at` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `internal_code` to the `products` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `method` on the `sale_movement_payments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - The required column `id` was added to the `sale_movements` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `sale_id` to the `sale_movements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock_lot_id` to the `sale_products` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EPosEventStatus" AS ENUM ('processed', 'canceled');

-- CreateEnum
CREATE TYPE "EPosStatus" AS ENUM ('opened', 'closed', 'under-review');

-- CreateEnum
CREATE TYPE "EPaymentMethod" AS ENUM ('cash', 'pix', 'credit-card', 'debit-card');

-- CreateEnum
CREATE TYPE "ESaleStatus" AS ENUM ('processed', 'canceled');

-- CreateEnum
CREATE TYPE "ENotificationType" AS ENUM ('info', 'success', 'warning', 'error', 'system', 'message', 'reminder', 'alert');

-- CreateEnum
CREATE TYPE "ENotificationTarget" AS ENUM ('user', 'tenant');

-- CreateEnum
CREATE TYPE "ENotificationTargetStatus" AS ENUM ('read', 'unread');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ESaleMovementType" ADD VALUE 'change';
ALTER TYPE "ESaleMovementType" ADD VALUE 'refund';
ALTER TYPE "ESaleMovementType" ADD VALUE 'withdrawal';

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_tenant_id_fkey";

-- AlterTable
ALTER TABLE "customers" ALTER COLUMN "phone_number" DROP NOT NULL;

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "read",
DROP COLUMN "tenant_id",
ADD COLUMN     "deleted_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "href" TEXT NOT NULL DEFAULT '#',
DROP COLUMN "type",
ADD COLUMN     "type" "ENotificationType" NOT NULL DEFAULT 'info';

-- AlterTable
ALTER TABLE "pos" ADD COLUMN     "status" "EPosStatus" NOT NULL DEFAULT 'opened';

-- AlterTable
ALTER TABLE "pos_event_entries" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(19,6);

-- AlterTable
ALTER TABLE "pos_event_outputs" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(19,6);

-- AlterTable
ALTER TABLE "pos_event_sale_products" ALTER COLUMN "cost_price" SET DATA TYPE DECIMAL(19,6),
ALTER COLUMN "sale_price" SET DATA TYPE DECIMAL(19,6);

-- AlterTable
ALTER TABLE "pos_event_sales" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(19,6);

-- AlterTable
ALTER TABLE "pos_events" ADD COLUMN     "status" "EPosEventStatus" NOT NULL DEFAULT 'processed';

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "internal_code" TEXT NOT NULL,
ALTER COLUMN "salePrice" SET DATA TYPE DECIMAL(19,6);

-- AlterTable
ALTER TABLE "sale_movement_payments" DROP COLUMN "method",
ADD COLUMN     "method" "EPaymentMethod" NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(19,6);

-- AlterTable
ALTER TABLE "sale_movements" DROP CONSTRAINT "sale_movements_pkey",
DROP COLUMN "saleId",
ADD COLUMN     "id" UUID NOT NULL,
ADD COLUMN     "sale_id" UUID NOT NULL,
ADD CONSTRAINT "sale_movements_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "sale_products" ADD COLUMN     "stock_lot_id" UUID NOT NULL,
ALTER COLUMN "cost_price" SET DATA TYPE DECIMAL(19,6),
ALTER COLUMN "sale_price" SET DATA TYPE DECIMAL(19,6);

-- AlterTable
ALTER TABLE "sales" DROP COLUMN "status",
ADD COLUMN     "status" "ESaleStatus" NOT NULL DEFAULT 'processed',
ALTER COLUMN "total" SET DATA TYPE DECIMAL(19,6);

-- AlterTable
ALTER TABLE "stock_lots" ALTER COLUMN "cost_price" SET DATA TYPE DECIMAL(19,6);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "first_access" BOOLEAN NOT NULL DEFAULT true;

-- DropEnum
DROP TYPE "ESaleMovementPaymentMethod";

-- CreateTable
CREATE TABLE "notification_targets" (
    "id" UUID NOT NULL,
    "status" "ENotificationTargetStatus" NOT NULL DEFAULT 'unread',
    "notification_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,

    CONSTRAINT "notification_targets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pos_event_sale_movements" (
    "id" UUID NOT NULL,
    "type" "ESaleMovementType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "pos_event_sale_id" UUID NOT NULL,

    CONSTRAINT "pos_event_sale_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pos_event_sale_movement_payments" (
    "id" UUID NOT NULL,
    "method" "EPaymentMethod" NOT NULL,
    "amount" DECIMAL(19,6) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pos_event_sale_movement_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pos_event_sale_movement_changes" (
    "id" UUID NOT NULL,
    "method" "EPaymentMethod" NOT NULL,
    "amount" DECIMAL(19,6) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pos_event_sale_movement_changes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sale_movement_changes" (
    "id" UUID NOT NULL,
    "method" "EPaymentMethod" NOT NULL,
    "amount" DECIMAL(19,6) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sale_movement_changes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_tenant_settings" (
    "do_not_disturb" BOOLEAN NOT NULL DEFAULT false,
    "user_id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,

    CONSTRAINT "user_tenant_settings_pkey" PRIMARY KEY ("user_id","tenant_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "notification_targets_notification_id_user_id_tenant_id_key" ON "notification_targets"("notification_id", "user_id", "tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "products_bar_code_key" ON "products"("bar_code");

-- CreateIndex
CREATE UNIQUE INDEX "products_internal_code_key" ON "products"("internal_code");

-- AddForeignKey
ALTER TABLE "notification_targets" ADD CONSTRAINT "notification_targets_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "notifications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_targets" ADD CONSTRAINT "notification_targets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_targets" ADD CONSTRAINT "notification_targets_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos_event_sale_movements" ADD CONSTRAINT "pos_event_sale_movements_pos_event_sale_id_fkey" FOREIGN KEY ("pos_event_sale_id") REFERENCES "pos_event_sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos_event_sale_movement_payments" ADD CONSTRAINT "pos_event_sale_movement_payments_id_fkey" FOREIGN KEY ("id") REFERENCES "pos_event_sale_movements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos_event_sale_movement_changes" ADD CONSTRAINT "pos_event_sale_movement_changes_id_fkey" FOREIGN KEY ("id") REFERENCES "pos_event_sale_movements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale_movements" ADD CONSTRAINT "sale_movements_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale_movement_payments" ADD CONSTRAINT "sale_movement_payments_id_fkey" FOREIGN KEY ("id") REFERENCES "sale_movements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale_movement_changes" ADD CONSTRAINT "sale_movement_changes_id_fkey" FOREIGN KEY ("id") REFERENCES "sale_movements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale_products" ADD CONSTRAINT "sale_products_stock_lot_id_fkey" FOREIGN KEY ("stock_lot_id") REFERENCES "stock_lots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tenant_settings" ADD CONSTRAINT "user_tenant_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tenant_settings" ADD CONSTRAINT "user_tenant_settings_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
