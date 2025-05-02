-- CreateEnum
CREATE TYPE "EInstallmentStatus" AS ENUM ('fully-paid', 'pending', 'non-paid', 'partially-paid');

-- CreateEnum
CREATE TYPE "EPeriod" AS ENUM ('daily', 'weekly', 'monthly');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('cpf', 'cnpj');

-- CreateEnum
CREATE TYPE "EMembershipRole" AS ENUM ('owner');

-- CreateEnum
CREATE TYPE "EStockStrategy" AS ENUM ('fifo', 'lifo');

-- CreateEnum
CREATE TYPE "ESaleMovementType" AS ENUM ('payment');

-- CreateEnum
CREATE TYPE "EPosEventType" AS ENUM ('sale', 'entry', 'output', 'payment', 'return', 'exchange');

-- CreateEnum
CREATE TYPE "ESaleMovementPaymentMethod" AS ENUM ('cash', 'pix', 'credit-card', 'debit-card');

-- CreateEnum
CREATE TYPE "EDiscountVariant" AS ENUM ('percentage', 'amount');

-- CreateEnum
CREATE TYPE "EStockEventType" AS ENUM ('entry', 'output');

-- CreateTable
CREATE TABLE "documents" (
    "id" UUID NOT NULL,
    "type" "DocumentType" NOT NULL,
    "number" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" UUID NOT NULL,
    "street" TEXT NOT NULL,
    "house_number" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "complement" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenants" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT DEFAULT '',
    "active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memberships" (
    "id" UUID NOT NULL,
    "role" "EMembershipRole" NOT NULL,
    "permissions" TEXT[],
    "active" BOOLEAN DEFAULT true,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_memberships" (
    "membership_id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,

    CONSTRAINT "tenant_memberships_pkey" PRIMARY KEY ("membership_id","tenant_id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "phone_number" TEXT NOT NULL,
    "active" BOOLEAN DEFAULT true,
    "tenant_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_specification" (
    "id" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "product_id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_specification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "bar_code" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sku_code" TEXT NOT NULL,
    "tenantId" UUID NOT NULL,
    "salePrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stocks" (
    "id" UUID NOT NULL,
    "strategy" "EStockStrategy" NOT NULL,
    "sku_id" UUID NOT NULL,
    "total_qty" INTEGER NOT NULL DEFAULT 0,
    "available_qty" INTEGER NOT NULL DEFAULT 0,
    "tenant_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_lots" (
    "id" UUID NOT NULL,
    "lot_number" TEXT NOT NULL,
    "total_qty" INTEGER NOT NULL DEFAULT 0,
    "cost_price" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "stock_id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_lots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_events" (
    "id" UUID NOT NULL,
    "type" "EStockEventType" NOT NULL,
    "stock_id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "stockLotId" UUID,

    CONSTRAINT "stock_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_event_entries" (
    "id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "stock_event_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_event_outputs" (
    "id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "stock_event_outputs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pos" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "tenant_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pos_events" (
    "id" UUID NOT NULL,
    "type" "EPosEventType" NOT NULL,
    "pos_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pos_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pos_event_entries" (
    "id" UUID NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "pos_event_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pos_event_outputs" (
    "id" UUID NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "pos_event_outputs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pos_event_sales" (
    "id" UUID NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "amount" DOUBLE PRECISION NOT NULL,
    "discount_variant" "EDiscountVariant" NOT NULL DEFAULT 'percentage',
    "discount_value" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "customer_id" UUID NOT NULL,
    "sale_id" UUID NOT NULL,

    CONSTRAINT "pos_event_sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pos_event_sale_products" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "cost_price" DOUBLE PRECISION NOT NULL,
    "sale_price" DOUBLE PRECISION NOT NULL,
    "total_qty" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "product_id" UUID NOT NULL,

    CONSTRAINT "pos_event_sale_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales" (
    "id" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "customer_id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "discount_variant" "EDiscountVariant" NOT NULL DEFAULT 'percentage',
    "discount_value" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sale_products" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "cost_price" DOUBLE PRECISION NOT NULL,
    "sale_price" DOUBLE PRECISION NOT NULL,
    "total_qty" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "sale_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,

    CONSTRAINT "sale_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sale_movements" (
    "type" "ESaleMovementType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "saleId" UUID NOT NULL,

    CONSTRAINT "sale_movements_pkey" PRIMARY KEY ("saleId")
);

-- CreateTable
CREATE TABLE "sale_movement_payments" (
    "id" UUID NOT NULL,
    "method" "ESaleMovementPaymentMethod" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sale_movement_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL,
    "tenant_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_code_key" ON "products"("sku_code");

-- CreateIndex
CREATE UNIQUE INDEX "stocks_sku_id_key" ON "stocks"("sku_id");

-- CreateIndex
CREATE UNIQUE INDEX "stock_lots_lot_number_key" ON "stock_lots"("lot_number");

-- CreateIndex
CREATE UNIQUE INDEX "sale_products_sale_id_product_id_key" ON "sale_products"("sale_id", "product_id");

-- AddForeignKey
ALTER TABLE "tenant_memberships" ADD CONSTRAINT "tenant_memberships_membership_id_fkey" FOREIGN KEY ("membership_id") REFERENCES "memberships"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_memberships" ADD CONSTRAINT "tenant_memberships_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_specification" ADD CONSTRAINT "product_specification_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocks" ADD CONSTRAINT "stocks_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocks" ADD CONSTRAINT "stocks_sku_id_fkey" FOREIGN KEY ("sku_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_lots" ADD CONSTRAINT "stock_lots_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "stocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_lots" ADD CONSTRAINT "stock_lots_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_events" ADD CONSTRAINT "stock_events_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "stocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_events" ADD CONSTRAINT "stock_events_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_events" ADD CONSTRAINT "stock_events_stockLotId_fkey" FOREIGN KEY ("stockLotId") REFERENCES "stock_lots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_event_entries" ADD CONSTRAINT "stock_event_entries_id_fkey" FOREIGN KEY ("id") REFERENCES "stock_events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_event_outputs" ADD CONSTRAINT "stock_event_outputs_id_fkey" FOREIGN KEY ("id") REFERENCES "stock_events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos_event_entries" ADD CONSTRAINT "pos_event_entries_id_fkey" FOREIGN KEY ("id") REFERENCES "pos_events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos_event_outputs" ADD CONSTRAINT "pos_event_outputs_id_fkey" FOREIGN KEY ("id") REFERENCES "pos_events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos_event_sales" ADD CONSTRAINT "pos_event_sales_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos_event_sales" ADD CONSTRAINT "pos_event_sales_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos_event_sales" ADD CONSTRAINT "pos_event_sales_id_fkey" FOREIGN KEY ("id") REFERENCES "pos_events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos_event_sale_products" ADD CONSTRAINT "pos_event_sale_products_id_fkey" FOREIGN KEY ("id") REFERENCES "pos_event_sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos_event_sale_products" ADD CONSTRAINT "pos_event_sale_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale_products" ADD CONSTRAINT "sale_products_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale_products" ADD CONSTRAINT "sale_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
