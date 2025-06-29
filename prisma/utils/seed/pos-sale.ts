import { EPosEventType, EStockEventType, Prisma, PrismaClient } from "@prisma/client";

export const seedPosSaleModule = async (
  tenantId: string,
  prisma: PrismaClient,
) => {
  // Seeds a PosSale with a single product.
  // This PosSale reflects the Sale seeded on 'seedSaleModule'.

  const product = {
    productId: "b3ff3d0c-67d0-4f24-b5f7-b796017f7ba2",
    name: "Tênis Infantil ColorFlex",
    description: "Tênis leve, com solado emborrachado e design colorido, desenvolvido especialmente para crianças em fase escolar. Oferece conforto e segurança nas atividades diárias.",
    salePrice: 139.9,
    costPrice: 68,
    totalQty: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await prisma.posEventSale.create({
    data: {
      amount: 0, // paid value
      customer: { connect: { id: "c025f2fd-9c95-4b90-b5bc-140bf60b5ef7" } },
      sale: { connect: { id: "d0d0a137-168b-44fd-9e2c-190e379fc134" } },
      description: "Venda de um sapato infantil para o Uncle Bob.",
      products: {
        create: product,
      },
      posEvent: {
        create: {
          type: EPosEventType.Sale,
          posId: "e7a63a06-cb88-4ab5-882c-77d91476b690",
        },
      },
    } as Prisma.PosEventSaleCreateInput,
  });

  await prisma.stock.update({
    where: { id: "0dfba8bf-d07d-4c65-b7d5-09df495161ee" },
    data: {
      availableQty: { decrement: product.totalQty },
      totalQty: { decrement: product.totalQty },
      lots: {
        update: {
          where: { id: "388c93df-7f54-4b98-bc99-59cb4a648cff" },
          data: { totalQty: { decrement: product.totalQty } },
        },
      },
    },
  });

  await prisma.stockEvent.create({
    data: {
      type: EStockEventType.Output,
      tenantId,
      stockId: "0dfba8bf-d07d-4c65-b7d5-09df495161ee",
      stockLotId: "388c93df-7f54-4b98-bc99-59cb4a648cff",
      output: {
        create: {
          quantity: product.totalQty,
          description: `Adeus, estoque! 🛒 Saíram ${product.totalQty} unidades do lote. Venda feita, espaço liberado — bora repor?`,
        },
      },
    },
  });
}