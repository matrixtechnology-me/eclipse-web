-- CreateEnum
CREATE TYPE "EExchangeMovementType" AS ENUM ('payment', 'change');

-- CreateTable
CREATE TABLE "lot_restorations" (
    "id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "stock_lot_usage_id" UUID NOT NULL,
    "pos_event_exchange_return_id" UUID NOT NULL,

    CONSTRAINT "lot_restorations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pos_event_exchanges" (
    "id" UUID NOT NULL,
    "sale_id" UUID NOT NULL,
    "discount_variant" "EDiscountVariant" NOT NULL DEFAULT 'percentage',
    "discount_value" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "pos_event_exchanges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pos_event_exchange_movements" (
    "id" UUID NOT NULL,
    "type" "EExchangeMovementType" NOT NULL,
    "method" "EPaymentMethod" NOT NULL,
    "amount" DECIMAL(19,6) NOT NULL,
    "pos_event_exchange_id" UUID NOT NULL,

    CONSTRAINT "pos_event_exchange_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pos_event_exchange_replacements" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "sale_price" DECIMAL(19,6) NOT NULL,
    "pos_event_exchange_id" UUID NOT NULL,

    CONSTRAINT "pos_event_exchange_replacements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pos_event_exchange_returns" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "pos_event_exchange_id" UUID NOT NULL,

    CONSTRAINT "pos_event_exchange_returns_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "lot_restorations" ADD CONSTRAINT "lot_restorations_stock_lot_usage_id_fkey" FOREIGN KEY ("stock_lot_usage_id") REFERENCES "stock_lot_usages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lot_restorations" ADD CONSTRAINT "lot_restorations_pos_event_exchange_return_id_fkey" FOREIGN KEY ("pos_event_exchange_return_id") REFERENCES "pos_event_exchange_returns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos_event_exchanges" ADD CONSTRAINT "pos_event_exchanges_id_fkey" FOREIGN KEY ("id") REFERENCES "pos_events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos_event_exchanges" ADD CONSTRAINT "pos_event_exchanges_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos_event_exchange_movements" ADD CONSTRAINT "pos_event_exchange_movements_pos_event_exchange_id_fkey" FOREIGN KEY ("pos_event_exchange_id") REFERENCES "pos_event_exchanges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos_event_exchange_replacements" ADD CONSTRAINT "pos_event_exchange_replacements_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos_event_exchange_replacements" ADD CONSTRAINT "pos_event_exchange_replacements_pos_event_exchange_id_fkey" FOREIGN KEY ("pos_event_exchange_id") REFERENCES "pos_event_exchanges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos_event_exchange_returns" ADD CONSTRAINT "pos_event_exchange_returns_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos_event_exchange_returns" ADD CONSTRAINT "pos_event_exchange_returns_pos_event_exchange_id_fkey" FOREIGN KEY ("pos_event_exchange_id") REFERENCES "pos_event_exchanges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
