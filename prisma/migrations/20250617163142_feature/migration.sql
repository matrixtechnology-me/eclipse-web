-- AlterTable
ALTER TABLE "products"
ADD COLUMN "public" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE
    "product_compositions" (
        "id" UUID NOT NULL,
        "parent_id" UUID NOT NULL,
        "child_id" UUID NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "product_compositions_pkey" PRIMARY KEY ("id")
    );

-- AddForeignKey
ALTER TABLE "product_compositions" ADD CONSTRAINT "product_compositions_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_compositions" ADD CONSTRAINT "product_compositions_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;