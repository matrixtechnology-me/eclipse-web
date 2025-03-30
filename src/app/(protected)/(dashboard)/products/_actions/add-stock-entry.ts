"use server";

import prisma from "@/lib/prisma";
import { ServerAction } from "@/types/server-actions";
import { reportError } from "@/utils/report-error";

type AddStockEntryActionPayload = {
  stockId: string;
  stockLotId: string;
  totalQty: number;
  tenantId: string;
};

type AddStockEntryActionResult = {};

export const addStockEntry: ServerAction<
  AddStockEntryActionPayload,
  AddStockEntryActionResult
> = async ({ stockId, totalQty, stockLotId, tenantId }) => {
  try {
    const incrementInput = {
      increment: totalQty,
    };

    await prisma.stock.update({
      where: {
        tenantId,
        id: stockId,
      },
      data: {
        availableQty: incrementInput,
        totalQty: incrementInput,
        lots: {
          update: {
            where: {
              id: stockLotId,
            },
            data: {
              totalQty: incrementInput,
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
