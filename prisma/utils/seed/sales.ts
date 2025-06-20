import { EDiscountVariant, ESaleStatus, PrismaClient } from "@prisma/client";

export const seedSaleModule = async (
  tenantId: string,
  prisma: PrismaClient,
) => {
  await prisma.sale.create({
    data: {
      id: "d0d0a137-168b-44fd-9e2c-190e379fc134",
      customerId: "c025f2fd-9c95-4b90-b5bc-140bf60b5ef7",
      internalCode: "DCA637",
      // Sum of each product p => p.salePrice * p.totalQty
      estimatedTotal: 139.9,
      paidTotal: 0,
      discountValue: 0,
      discountVariant: EDiscountVariant.Percentage,
      status: ESaleStatus.Processed,
      tenantId,
      createdAt: new Date(),
      updatedAt: new Date(),
      products: {
        createMany: {
          data: [
            {
              id: "8d0a78b4-a226-4edb-9177-50e7ab32a1ba",
              productId: "b3ff3d0c-67d0-4f24-b5f7-b796017f7ba2",
              name: "Tênis Infantil ColorFlex",
              description: "Tênis leve, com solado emborrachado e design colorido, desenvolvido especialmente para crianças em fase escolar. Oferece conforto e segurança nas atividades diárias.",
              salePrice: 139.9,
              totalQty: 1,
              stockLotId: "388c93df-7f54-4b98-bc99-59cb4a648cff",
              costPrice: 68,
              createdAt: new Date(),
              updatedAt: new Date(),
            }
          ]
        }
      }
    },
  });
}