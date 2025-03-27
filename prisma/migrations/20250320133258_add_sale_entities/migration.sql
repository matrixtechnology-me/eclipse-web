-- CreateTable
CREATE TABLE "sales" (
    "id" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sale_products" (
    "name" TEXT NOT NULL,
    "description" TEXT DEFAULT '',
    "cost_price" DOUBLE PRECISION NOT NULL,
    "sale_price" DOUBLE PRECISION NOT NULL,
    "sale_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,

    CONSTRAINT "sale_products_pkey" PRIMARY KEY ("sale_id","product_id")
);
