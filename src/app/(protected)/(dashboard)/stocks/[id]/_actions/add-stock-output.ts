"use server";

import prisma from "@/lib/prisma";
import { failure, ServerAction, success } from "@/core/server-actions";
import { BadRequestError, InternalServerError, NotFoundError } from "@/errors";
import { EStockEventType } from "@prisma/client";
import { CACHE_TAGS } from "@/config/cache-tags";
import { revalidateTag } from "next/cache";

export const addStockOutput: ServerAction<
  {
    stockId: string;
    stockLotId: string;
    totalQty: number;
    tenantId: string;
    description?: string;
  },
  void
> = async ({ stockId, stockLotId, totalQty, tenantId, description = "" }) => {
  try {
    if (!stockId || !stockLotId || !tenantId || totalQty <= 0) {
      throw new BadRequestError("Invalid input parameters");
    }

    const decrementInput = { decrement: totalQty };

    await prisma.$transaction(async (tx) => {
      const stock = await tx.stock.findUnique({
        where: { id: stockId, tenantId },
      });
      if (!stock) throw new NotFoundError("Stock not found");

      const lot = await tx.stockLot.findUnique({
        where: { id: stockLotId, stockId },
      });
      if (!lot) throw new NotFoundError("Stock lot not found");
      if (lot.totalQty < totalQty)
        throw new BadRequestError("Insufficient stock");

      const stockEvent = await tx.stockEvent.create({
        data: {
          type: EStockEventType.Output,
          stockId,
          tenantId,
          description,
        },
      });

      await tx.stockEventOutput.create({
        data: {
          id: stockEvent.id,
          quantity: totalQty,
          description,
        },
      });

      await tx.stock.update({
        where: { id: stockId, tenantId },
        data: {
          availableQty: decrementInput,
          totalQty: decrementInput,
          lots: {
            update: {
              where: { id: stockLotId },
              data: { totalQty: decrementInput },
            },
          },
        },
      });
    });

    revalidateTag(CACHE_TAGS.TENANT(tenantId).STOCKS.STOCK(stockId).EVENTS);

    return success(undefined);
  } catch (error: unknown) {
    console.error("Failed to add stock output:", error);
    return failure(new InternalServerError());
  }
};
