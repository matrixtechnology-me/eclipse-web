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
      {
        // Vestido Infantil Floral Dreams
        id: "e36f9bb1-8d2d-4c5b-91cf-ff4b42b4a701",
        strategy: EStockStrategy.Fifo,
        availableQty: 80,
        totalQty: 80,
        productId: "e8c35d6a-2c7e-4c87-bf91-6a3489e302e1",
        tenantId,
      },
      {
        // Sandália Kids Star Light
        id: "1f4ce6c3-11f9-4456-90f9-122f119e3a75",
        strategy: EStockStrategy.Fifo,
        availableQty: 60,
        totalQty: 60,
        productId: "a1b2c3d4-e5f6-47a8-91b2-c3d4e5f67890",
        tenantId,
      },
      {
        // Blocos de Montar Criativos
        id: "c00efccd-df5e-47cf-b582-40d6837ec68e",
        strategy: EStockStrategy.Fifo,
        availableQty: 120,
        totalQty: 120,
        productId: "b9e1c2d3-4f5a-6789-8b1c-2d3e4f5a6789",
        tenantId,
      },
      {
        // Patinete Divertix
        id: "d8734ea6-8cb7-4fcf-a342-fae8e5c8c2df",
        strategy: EStockStrategy.Fifo,
        availableQty: 30,
        totalQty: 30,
        productId: "c1d2e3f4-5a6b-7c8d-9e0f-1a2b3c4d5e6f",
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
      {
        id: "f2b1b80f-7c31-4f48-8e0a-7c1a98f2d123",
        lotNumber: "a3c9f1",
        totalQty: 80,
        costPrice: 42,
        tenantId,
        stockId: "e36f9bb1-8d2d-4c5b-91cf-ff4b42b4a701",
      },
      {
        id: "c2d3e4f5-a6b7-48c9-8023-9e0f1a2b3c4d",
        lotNumber: "b7e2d4",
        totalQty: 60,
        costPrice: 33.5,
        tenantId,
        stockId: "1f4ce6c3-11f9-4456-90f9-122f119e3a75",
      },
      {
        id: "7c8d9e0f-1a2b-3c4d-5e6f-7890abcdef12",
        lotNumber: "c1d7e3",
        totalQty: 120,
        costPrice: 28,
        tenantId,
        stockId: "c00efccd-df5e-47cf-b582-40d6837ec68e",
      },
      {
        id: "4a5b6c7d-8e9f-4012-a3b4-c5d6e7f890ab",
        lotNumber: "d8f4a6",
        totalQty: 30,
        costPrice: 110,
        tenantId,
        stockId: "d8734ea6-8cb7-4fcf-a342-fae8e5c8c2df",
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
      {
        id: "9a0b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d",
        type: EStockEventType.Entry,
        stockId: "e36f9bb1-8d2d-4c5b-91cf-ff4b42b4a701",
        tenantId,
        description: `Lote a3c9f1 chegou! 👗 80 unidades do Vestido Floral Dreams recebidas. Custo: R$3.360,00.`,
      },
      {
        id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
        type: EStockEventType.Entry,
        stockId: "1f4ce6c3-11f9-4456-90f9-122f119e3a75",
        tenantId,
        description: `Lote b7e2d4 chegou! 👡 60 unidades da Sandália Star Light recebidas. Custo: R$2.010,00.`,
      },
      {
        id: "d6e7f890-abcd-4e5f-9012-3456789abcde",
        type: EStockEventType.Entry,
        stockId: "c00efccd-df5e-47cf-b582-40d6837ec68e",
        tenantId,
        description: `Lote c1d7e3 chegou! 🧱 120 unidades dos Blocos Criativos recebidas. Custo: R$3.360,00.`,
      },
      {
        id: "e0f1a2b3-c4d5-4e6f-9012-3456789abcdf",
        type: EStockEventType.Entry,
        stockId: "d8734ea6-8cb7-4fcf-a342-fae8e5c8c2df",
        tenantId,
        description: `Lote d8f4a6 chegou! 🛴 30 unidades do Patinete Divertix recebidas. Custo: R$3.300,00.`,
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
      {
        id: "9a0b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d",
        quantity: 80,
        description: `Lote A3C9F1 chegou! 👗 80 unidades do Vestido Floral Dreams recebidas. Custo: R$3.360,00.`,
      },
      {
        id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
        quantity: 60,
        description: `Lote B7E2D4 chegou! 👡 60 unidades da Sandália Star Light recebidas. Custo: R$2.010,00.`,
      },
      {
        id: "d6e7f890-abcd-4e5f-9012-3456789abcde",
        quantity: 120,
        description: `Lote C1D7E3 chegou! 🧱 120 unidades dos Blocos Criativos recebidas. Custo: R$3.360,00.`,
      },
      {
        id: "e0f1a2b3-c4d5-4e6f-9012-3456789abcdf",
        quantity: 30,
        description: `Lote D8F4A6 chegou! 🛴 30 unidades do Patinete Divertix recebidas. Custo: R$3.300,00.`,
      },
    ],
  });
}