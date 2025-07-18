import { EPosEventType, EStockEventType, Prisma, PrismaClient } from "@prisma/client";

export const seedPosSaleModule = async (
  tenantId: string,
  prisma: PrismaClient,
) => {
  // PosSale reflects the Sale seeded on 'seedSaleModule'.

  const product1 = {
    productId: "b3ff3d0c-67d0-4f24-b5f7-b796017f7ba2",
    name: "Tênis Infantil ColorFlex",
    description: "Tênis leve, com solado emborrachado e design colorido, desenvolvido especialmente para crianças em fase escolar. Oferece conforto e segurança nas atividades diárias.",
    salePrice: 139.9,
    totalQty: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const product2 = {
    productId: "d5c7a1f2-3bfa-46e0-8b22-12f34c56d789",
    name: "Quebra-Cabeça Alfabeto Divertido",
    description: "Quebra-cabeça educativo com peças em madeira que ajudam as crianças a aprender o alfabeto brincando. Estimula a coordenação motora e o raciocínio lógico.",
    salePrice: 59.9,
    totalQty: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const product3 = {
    productId: "c1d2e3f4-5a6b-7c8d-9e0f-1a2b3c4d5e6f",
    name: "Patinete Divertix 3 Rodas",
    description: "Patinete estável com 3 rodas, ideal para o desenvolvimento do equilíbrio e coordenação motora. Indicado para crianças a partir de 3 anos.",
    salePrice: 197.65,
    totalQty: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await prisma.posEventSale.create({
    data: {
      amount: 0, // paid value
      customer: { connect: { id: "c025f2fd-9c95-4b90-b5bc-140bf60b5ef7" } },
      sale: { connect: { id: "d0d0a137-168b-44fd-9e2c-190e379fc134" } },
      description: "Venda de um sapato infantil, quebra-cabeças e patinetes para o Uncle Bob.",
      products: {
        createMany: {
          data: [product1, product2, product3],
        },
      },
      posEvent: {
        create: {
          type: EPosEventType.Sale,
          posId: "e7a63a06-cb88-4ab5-882c-77d91476b690",
        },
      },
    } as Prisma.PosEventSaleCreateInput,
  });

  await Promise.all([
    prisma.stock.update({
      where: { id: "0dfba8bf-d07d-4c65-b7d5-09df495161ee" },
      data: {
        availableQty: { decrement: product1.totalQty },
        totalQty: { decrement: product1.totalQty },
        lots: {
          update: {
            where: { id: "388c93df-7f54-4b98-bc99-59cb4a648cff" },
            data: { totalQty: { decrement: product1.totalQty } },
          },
        },
      },
    }),
    prisma.stock.update({
      where: { id: "5d7c9e68-1b2a-4af9-8e37-3f4c2a20ef79" },
      data: {
        availableQty: { decrement: product2.totalQty },
        totalQty: { decrement: product2.totalQty },
        lots: {
          update: {
            where: { id: "e41f1db2-cd84-45eb-b93f-8a0646d47b6e" },
            data: { totalQty: { decrement: product2.totalQty } },
          },
        },
      },
    }),
    prisma.stock.update({
      where: { id: "d8734ea6-8cb7-4fcf-a342-fae8e5c8c2df" },
      data: {
        availableQty: { decrement: product3.totalQty },
        totalQty: { decrement: product3.totalQty },
        lots: {
          update: {
            where: { id: "4a5b6c7d-8e9f-4012-a3b4-c5d6e7f890ab" },
            data: { totalQty: { decrement: product3.totalQty } },
          },
        },
      },
    }),
  ]);

  await Promise.all([
    prisma.stockEvent.create({
      data: {
        type: EStockEventType.Output,
        tenantId,
        stockId: "0dfba8bf-d07d-4c65-b7d5-09df495161ee",
        stockLotId: "388c93df-7f54-4b98-bc99-59cb4a648cff",
        output: {
          create: {
            quantity: product1.totalQty,
            description: `Adeus, estoque! 🛒 Saíram ${product1.totalQty} unidades do lote. Venda feita, espaço liberado — bora repor?`,
          },
        },
      },
    }),
    prisma.stockEvent.create({
      data: {
        type: EStockEventType.Output,
        tenantId,
        stockId: "5d7c9e68-1b2a-4af9-8e37-3f4c2a20ef79",
        stockLotId: "e41f1db2-cd84-45eb-b93f-8a0646d47b6e",
        output: {
          create: {
            quantity: product2.totalQty,
            description: `Adeus, estoque! 🛒 Saíram ${product2.totalQty} unidades do lote. Venda feita, espaço liberado — bora repor?`,
          },
        },
      },
    }),
    prisma.stockEvent.create({
      data: {
        type: EStockEventType.Output,
        tenantId,
        stockId: "d8734ea6-8cb7-4fcf-a342-fae8e5c8c2df",
        stockLotId: "4a5b6c7d-8e9f-4012-a3b4-c5d6e7f890ab",
        output: {
          create: {
            quantity: product3.totalQty,
            description: `Adeus, estoque! 🛒 Saíram ${product3.totalQty} unidades do lote. Venda feita, espaço liberado — bora repor?`,
          },
        },
      },
    }),
  ]);

  await prisma.stockLotUsage.createMany({
    data: [
      {
        quantity: 1,
        stockLotId: "388c93df-7f54-4b98-bc99-59cb4a648cff",
        saleProductId: "8d0a78b4-a226-4edb-9177-50e7ab32a1ba",
      },
      {
        quantity: 2,
        stockLotId: "e41f1db2-cd84-45eb-b93f-8a0646d47b6e",
        saleProductId: "1b7e437f-c159-4b33-8db2-89e4d6ff9d01",
      },
      {
        quantity: 3,
        stockLotId: "4a5b6c7d-8e9f-4012-a3b4-c5d6e7f890ab",
        saleProductId: "73f35c5b-4d1a-4ea0-98ec-1574d378e47a",
      },
    ]
  });
}
