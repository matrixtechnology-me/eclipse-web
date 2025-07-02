import { EStockEventType, EStockStrategy, PrismaClient } from "@prisma/client";

export const seedStockModule = async (
  tenantId: string,
  prisma: PrismaClient,
) => {
  await prisma.stock.createMany({
    data: [
      {
        id: "0dfba8bf-d07d-4c65-b7d5-09df495161ee",
        strategy: EStockStrategy.Fifo,
        availableQty: 100,
        totalQty: 100,
        productId: "b3ff3d0c-67d0-4f24-b5f7-b796017f7ba2",
        tenantId,
      },
      {
        id: "5d7c9e68-1b2a-4af9-8e37-3f4c2a20ef79",
        strategy: EStockStrategy.Fifo,
        availableQty: 50,
        totalQty: 50,
        productId: "d5c7a1f2-3bfa-46e0-8b22-12f34c56d789",
        tenantId,
      },
    ],
  });

  await prisma.stockLot.createMany({
    data: [
      {
        id: "388c93df-7f54-4b98-bc99-59cb4a648cff",
        lotNumber: "dd6da5",
        totalQty: 100,
        costPrice: 68,
        tenantId,
        stockId: "0dfba8bf-d07d-4c65-b7d5-09df495161ee",
      },
      {
        id: "e41f1db2-cd84-45eb-b93f-8a0646d47b6e",
        lotNumber: "dd6da9",
        totalQty: 50,
        costPrice: 21.35,
        tenantId,
        stockId: "5d7c9e68-1b2a-4af9-8e37-3f4c2a20ef79",
      },
    ],
  });

  await prisma.stockEvent.createMany({
    data: [
      {
        id: "3f976ccb-426c-4175-bf69-308ed8ad34e3",
        type: EStockEventType.Entry,
        stockId: "0dfba8bf-d07d-4c65-b7d5-09df495161ee",
        tenantId,
        description: `Lote dd6da5 chegou! 🎉 São 100 unidades a caminho. Custo: $R$6.800,00. Vamos vender!`,
      },
      {
        id: "23a9d38e-f8ea-45b3-9302-f6a3ddda87b4",
        type: EStockEventType.Entry,
        stockId: "5d7c9e68-1b2a-4af9-8e37-3f4c2a20ef79",
        tenantId,
        description: `Lote dd6da9 chegou! 🎉 São 50 unidades a caminho. Custo: $R$1.067,50. Vamos vender!`,
      },
    ],
  });

  await prisma.stockEventEntry.createMany({
    data: [
      {
        id: "3f976ccb-426c-4175-bf69-308ed8ad34e3",
        quantity: 100,
        description: `Lote DD6DA5 chegou! 🎉 São 100 unidades a caminho. Custo: $R$6.800,00. Vamos vender!`,
      },
      {
        id: "23a9d38e-f8ea-45b3-9302-f6a3ddda87b4",
        quantity: 50,
        description: `Lote DD6DA9 chegou! 🎉 São 50 unidades a caminho. Custo: $R$1.067,50. Vamos vender!`,
      },
    ],
  });
}