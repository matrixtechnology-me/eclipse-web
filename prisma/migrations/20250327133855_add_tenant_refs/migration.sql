/*
  Warnings:

  - You are about to drop the `expenses` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tenantId` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `receivables` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `sales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "tenantId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "tenantId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "tenantId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "receivables" ADD COLUMN     "tenantId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "sales" ADD COLUMN     "tenantId" UUID NOT NULL;

-- DropTable
DROP TABLE "expenses";

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receivables" ADD CONSTRAINT "receivables_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
