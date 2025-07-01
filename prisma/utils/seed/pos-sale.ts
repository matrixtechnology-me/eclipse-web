import { EPosEventType, EStockEventType, Prisma, PrismaClient } from "@prisma/client";

export const seedPosSaleModule = async (
  tenantId: string,
  prisma: PrismaClient,
) => {
  // Seeds a PosSale with a single product.
  // This PosSale reflects the Sale seeded on 'seedSaleModule'.

  const product1 = {
    productId: "b3ff3d0c-67d0-4f24-b5f7-b796017f7ba2",
    name: "Tênis Infantil ColorFlex",
    description: "Tênis leve, com solado emborrachado e design colorido, desenvolvido especialmente para crianças em fase escolar. Oferece conforto e segurança nas atividades diárias.",
    salePrice: 139.9,
    costPrice: 68,
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
    costPrice: 21.35,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await prisma.posEventSale.create({
    data: {
      amount: 0, // paid value
      customer: { connect: { id: "c025f2fd-9c95-4b90-b5bc-140bf60b5ef7" } },
      sale: { connect: { id: "d0d0a137-168b-44fd-9e2c-190e379fc134" } },
      description: "Venda de um sapato infantil e quebra-cabeças para o Uncle Bob.",
      products: {
        createMany: {
          data: [product1, product2],
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
    })
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
    })
  ]);
}