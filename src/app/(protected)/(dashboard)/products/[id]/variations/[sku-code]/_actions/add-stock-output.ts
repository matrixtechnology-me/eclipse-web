"use server";

import prisma from "@/lib/prisma";
import { ServerAction } from "@/types/server-actions";
import { reportError } from "@/utils/report-error";

type AddStockOutputActionPayload = {
  stockId: string;
  stockLotId: string;
  totalQty: number;
  tenantId: string;
};

type AddStockOutputActionResult = {};

export const addStockOutput: ServerAction<
  AddStockOutputActionPayload,
  AddStockOutputActionResult
> = async ({ stockId, totalQty, stockLotId, tenantId }) => {
  try {
    const decrementInput = {
      decrement: totalQty,
    };

    await prisma.stock.update({
      where: {
        tenantId,
        id: stockId,
      },
      data: {
        availableQty: decrementInput,
        totalQty: decrementInput,
        lots: {
          update: {
            where: {
              id: stockLotId,
            },
            data: {
              totalQty: decrementInput,
            },
          },
        },
      },
    });

    return { data: {} };
  } catch (error) {
    return reportError(error);
  }
};
