"use server";

import prisma from "@/lib/prisma";
import { ServerAction } from "@/types/server-actions";
import { reportError } from "@/utils/report-error";

type CreateLotActionPayload = {
  costPrice: number;
  totalQty: number;
  expiresAt?: Date;
  stockId: string;
  tenantId: string;
};

type CreateLotActionResult = {};

export const createLot: ServerAction<
  CreateLotActionPayload,
  CreateLotActionResult
> = async ({ costPrice, stockId, totalQty, tenantId, expiresAt = null }) => {
  try {
    await prisma.stockLot.create({
      data: {
        stockId,
        lotNumber: Math.floor(Math.random() * 0xffffff)
          .toString(16)
          .padStart(6, "0"),
        tenantId,
        costPrice,
        totalQty,
        expiresAt,
      },
    });

    await prisma.stock.update({
      where: {
        id: stockId,
      },
      data: {
        totalQty: {
          increment: totalQty,
        },
        availableQty: {
          increment: totalQty,
        },
      },
    });

    return { data: {} };
  } catch (error) {
    return reportError(error);
  }
};
