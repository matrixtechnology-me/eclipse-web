"use server";

import { NotFoundError } from "@/errors/http/not-found.error";
import prisma from "@/lib/prisma";
import { Action, success, failure } from "@/core/action";
import { EStockStrategy } from "@prisma/client";
import { InternalServerError } from "@/errors";

type CreateSaleActionPayload = {
  customerId: string;
  tenantId: string;
  products: {
    id: string;
    totalQty: number;
  }[];
};

export const createSale: Action<CreateSaleActionPayload, void> = async ({
  customerId,
  products,
  tenantId,
}) => {
  try {
    const saleProducts = await Promise.all(
      products.map(async (saleProduct) => {
        const product = await prisma.product.findUnique({
          where: { id: saleProduct.id },
          include: { stock: { select: { id: true, strategy: true } } },
        });

        if (!product?.stock) {
          throw new NotFoundError("Product stock not found");
        }

        const orderDirection =
          product.stock.strategy === EStockStrategy.Fifo ? "asc" : "desc";
        const [targetLot] = await prisma.stockLot.findMany({
          where: { stockId: product.stock.id },
          orderBy: { expiresAt: orderDirection },
          take: 1,
        });

        if (!targetLot) {
          throw new NotFoundError("No lots in product stock");
        }

        return {
          costPrice: targetLot.costPrice,
          description: product.description,
          name: product.name,
          productId: product.id,
          salePrice: product.salePrice,
          totalQty: saleProduct.totalQty,
          stockId: product.stock.id,
          stockLotId: targetLot.id,
        };
      })
    );

    await prisma.sale.create({
      data: {
        customerId,
        tenantId,
        products: {
          createMany: {
            data: saleProducts.map(({ stockId, ...rest }) => rest),
          },
        },
        total: saleProducts.reduce(
          (acc, saleProduct) =>
            acc + saleProduct.salePrice.toNumber() * saleProduct.totalQty,
          0
        ),
      },
    });

    await Promise.all(
      saleProducts.map(async ({ stockId, stockLotId, totalQty }) => {
        const decrement = { decrement: totalQty };
        await prisma.stock.update({
          where: { id: stockId },
          data: {
            availableQty: decrement,
            totalQty: decrement,
            lots: {
              update: {
                where: { id: stockLotId },
                data: { totalQty: decrement },
              },
            },
          },
        });
      })
    );

    return success(undefined);
  } catch (error: unknown) {
    console.error("Failed to create sale:", error);
    return failure(new InternalServerError());
  }
};
