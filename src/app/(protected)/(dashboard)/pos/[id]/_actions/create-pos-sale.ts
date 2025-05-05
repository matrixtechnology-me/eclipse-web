"use server";

import { CACHE_TAGS } from "@/config/cache-tags";
import { failure, ServerAction, success } from "@/core/server-actions";
import { InternalServerError, NotFoundError } from "@/errors";
import prisma from "@/lib/prisma";
import { EPosEventType, EStockStrategy, Prisma } from "@prisma/client";
import { revalidateTag } from "next/cache";

type CreatePosSaleActionPayload = {
  description: string;
  customerId: string;
  posId: string;
  products: {
    id: string;
    totalQty: number;
  }[];
  tenantId: string;
};

export const createPosSaleAction: ServerAction<
  CreatePosSaleActionPayload,
  unknown
> = async ({ customerId, products, description, posId, tenantId }) => {
  try {
    const pos = await prisma.pos.findUnique({
      where: {
        id: posId,
      },
    });

    if (!pos) return failure(new NotFoundError("not found POS"));

    const mappedProducts = await Promise.all(
      products.map(async (saleProduct) => {
        const product = await prisma.product.findUnique({
          where: { id: saleProduct.id },
          include: { stock: { select: { id: true, strategy: true } } },
        });

        if (!product?.stock) {
          throw new NotFoundError("product stock not found");
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

    const total = mappedProducts.reduce(
      (acc, saleProduct) =>
        acc + saleProduct.salePrice.toNumber() * saleProduct.totalQty,
      0
    );

    const sale = await prisma.sale.create({
      data: {
        customerId,
        tenantId: pos.tenantId,
        products: {
          createMany: {
            data: mappedProducts.map(
              ({ stockId, stockLotId, ...rest }) => rest
            ),
          },
        },
        total,
      },
    });

    await prisma.posEventSale.create({
      data: {
        amount: total,
        description,
        customer: {
          connect: {
            id: customerId,
          },
        },
        sale: {
          connect: {
            id: sale.id,
          },
        },
        products: {
          createMany: {
            data: mappedProducts.map(
              ({ stockId, stockLotId, ...rest }) => rest
            ),
          },
        },
        posEvent: {
          create: {
            type: EPosEventType.Sale,
            posId,
          },
        },
      } as Prisma.PosEventSaleCreateInput,
    });

    await Promise.all(
      mappedProducts.map(async ({ stockId, stockLotId, totalQty }) => {
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

    revalidateTag(CACHE_TAGS.TENANT(tenantId).POS.POS(posId).INDEX);

    return success({});
  } catch (error) {
    console.error(error);
    return failure(
      new InternalServerError(
        "cannot create a new pos sale event because error: " + error
      )
    );
  }
};
