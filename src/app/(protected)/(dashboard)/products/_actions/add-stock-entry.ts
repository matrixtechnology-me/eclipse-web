"use server";

import prisma from "@/lib/prisma";
import { failure, ServerAction, success } from "@/core/server-actions";
import { reportError } from "@/utils/report-error.util";
import { BadRequestError, InternalServerError, NotFoundError } from "@/errors";

export const addStockEntry: ServerAction<
  {
    stockId: string;
    stockLotId: string;
    totalQty: number;
    tenantId: string;
  },
  void
> = async ({ stockId, stockLotId, totalQty, tenantId }) => {
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

      return await tx.stock.update({
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

    return success(undefined);
  } catch (error: unknown) {
    console.error("Failed to add stock entry:", error);
    return failure(new InternalServerError());
  }
};
