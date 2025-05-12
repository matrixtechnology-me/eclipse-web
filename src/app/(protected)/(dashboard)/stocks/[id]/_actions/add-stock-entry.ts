"use server";

import prisma from "@/lib/prisma";
import { failure, Action, success } from "@/core/action";
import { BadRequestError, InternalServerError, NotFoundError } from "@/errors";
import { EStockEventType } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/cache-tags";

export const addStockEntry: Action<
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

    const incrementInput = { increment: totalQty };

    await prisma.$transaction(async (tx) => {
      const stock = await tx.stock.findUnique({
        where: { id: stockId, tenantId },
      });
      if (!stock) throw new NotFoundError("Stock not found");

      const lot = await tx.stockLot.findUnique({
        where: { id: stockLotId, stockId },
      });
      if (!lot) throw new NotFoundError("Stock lot not found");

      const stockEvent = await tx.stockEvent.create({
        data: {
          type: EStockEventType.Entry,
          stockId,
          tenantId,
          description,
        },
      });

      await tx.stockEventEntry.create({
        data: {
          id: stockEvent.id,
          quantity: totalQty,
          description,
        },
      });

      await tx.stock.update({
        where: { id: stockId, tenantId },
        data: {
          availableQty: incrementInput,
          totalQty: incrementInput,
          lots: {
            update: {
              where: { id: stockLotId },
              data: { totalQty: incrementInput },
            },
          },
        },
      });
    });

    revalidateTag(CACHE_TAGS.TENANT(tenantId).STOCKS.STOCK(stockId).EVENTS);

    return success(undefined);
  } catch (error: unknown) {
    console.error("Failed to add stock entry:", error);
    return failure(new InternalServerError());
  }
};
