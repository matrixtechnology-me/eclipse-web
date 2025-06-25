import { EStockEventType, EStockStrategy, PrismaClient } from "@prisma/client";

export const seedStockModule = async (
  tenantId: string,
  prisma: PrismaClient,
) => {
  await prisma.stock.create({
    data: {
      id: "0dfba8bf-d07d-4c65-b7d5-09df495161ee",
      strategy: EStockStrategy.Fifo,
      availableQty: 100,
      totalQty: 100,
      productId: "b3ff3d0c-67d0-4f24-b5f7-b796017f7ba2",
      tenantId,
    },
  });

  await prisma.stockLot.create({
    data: {
      id: "388c93df-7f54-4b98-bc99-59cb4a648cff",
      lotNumber: "dd6da5",
      totalQty: 100,
      costPrice: 68,
      tenantId,
      stockId: "0dfba8bf-d07d-4c65-b7d5-09df495161ee",
    },
  });

  await prisma.stockEvent.create({
    data: {
      id: "3f976ccb-426c-4175-bf69-308ed8ad34e3",
      type: EStockEventType.Entry,
      stockId: "0dfba8bf-d07d-4c65-b7d5-09df495161ee",
      tenantId,
      description: `Lote dd6da5 chegou! 🎉 São 100 unidades a caminho. Custo: $R$6.800,00. Vamos vender!`,
    },
  });

  await prisma.stockEventEntry.create({
    data: {
      id: "3f976ccb-426c-4175-bf69-308ed8ad34e3",
      quantity: 100,
      description: `Lote DD6DA5 chegou! 🎉 São 100 unidades a caminho. Custo: $R$6.800,00. Vamos vender!`,
    },
  });
}