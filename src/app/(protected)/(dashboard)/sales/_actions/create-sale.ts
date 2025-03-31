"use server";

import { NotFoundError } from "@/errors/not-found";
import prisma from "@/lib/prisma";
import { ServerAction } from "@/types/server-actions";
import { propagateError } from "@/utils/propagate-error";
import { EStockStrategy, SaleProduct } from "@prisma/client";

type CreateSaleActionPayload = {
  customerId: string;
  tenantId: string;
  products: {
    id: string;
    totalQty: number;
  }[];
};

type CreateSaleActionResult = {};

export const createSale: ServerAction<
  CreateSaleActionPayload,
  CreateSaleActionResult
> = async ({ customerId, products, tenantId }) => {
  try {
    const saleProducts = await Promise.all(
      products.map(
        async (
          saleProduct
        ): Promise<
          Omit<SaleProduct, "saleId"> & { stockId: string; stockLotId: string }
        > => {
          const product = await prisma.product.findUnique({
            where: {
              id: saleProduct.id,
            },
            include: {
              stock: {
                select: {
                  id: true,
                  strategy: true,
                },
              },
            },
          });

          if (!product?.stock)
            throw new NotFoundError({ message: "product stock not found" });

          const lots = await prisma.stockLot.findMany({
            where: {
              stockId: product.stock.id,
            },
            orderBy: {
              expiresAt:
                product.stock.strategy === EStockStrategy.Fifo ? "asc" : "desc",
            },
          });

          if (!lots?.length)
            throw new NotFoundError({ message: "no lots in product stock" });

          const targetLot = lots[0];

          return {
            costPrice: targetLot.costPrice.toNumber(),
            description: product.description,
            name: product.name,
            productId: product.id,
            salePrice: product.salePrice.toNumber(),
            totalQty: saleProduct.totalQty,
            stockId: product.stock.id,
            stockLotId: targetLot.id,
          };
        }
      )
    );

    await prisma.sale.create({
      data: {
        customerId,
        tenantId,
        products: {
          createMany: {
            data: saleProducts.map(
              (saleProduct): Omit<SaleProduct, "saleId"> => ({
                costPrice: saleProduct.costPrice,
                name: saleProduct.name,
                productId: saleProduct.productId,
                salePrice: saleProduct.salePrice,
                description: saleProduct.description,
                totalQty: saleProduct.totalQty,
              })
            ),
          },
        },
      },
    });

    await Promise.all(
      saleProducts.map(async (saleProduct) => {
        const decrementInput = {
          decrement: saleProduct.totalQty,
        };

        await prisma.stock.update({
          where: {
            id: saleProduct.stockId,
          },
          data: {
            availableQty: decrementInput,
            totalQty: decrementInput,
            lots: {
              update: {
                where: {
                  id: saleProduct.stockLotId,
                },
                data: {
                  totalQty: decrementInput,
                },
              },
            },
          },
        });
      })
    );

    return { data: {} };
  } catch (error) {
    return propagateError(error as Error);
  }
};
