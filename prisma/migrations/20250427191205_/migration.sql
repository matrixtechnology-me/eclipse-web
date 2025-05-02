/*
  Warnings:

  - The primary key for the `pos_event_sales` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `pos_event_id` on the `pos_event_sales` table. All the data in the column will be lost.
  - Added the required column `amount` to the `pos_event_sales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_id` to the `pos_event_sales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `pos_event_sales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pos_event_sales" DROP CONSTRAINT "pos_event_sales_pkey",
DROP COLUMN "pos_event_id",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "customer_id" UUID NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "discount_value" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "discount_variant" "EDiscountVariant" NOT NULL DEFAULT 'percentage',
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "pos_event_sales_pkey" PRIMARY KEY ("id");

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

-- AddForeignKey
ALTER TABLE "pos_event_sales" ADD CONSTRAINT "pos_event_sales_id_fkey" FOREIGN KEY ("id") REFERENCES "pos_events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos_event_sale_products" ADD CONSTRAINT "pos_event_sale_products_id_fkey" FOREIGN KEY ("id") REFERENCES "pos_event_sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos_event_sale_products" ADD CONSTRAINT "pos_event_sale_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
