"use server";

import prisma from "@/lib/prisma";
import { ServerAction, success } from "@/core/server-actions";
import { reportError } from "@/utils/report-error.util";
import { BadRequestError, NotFoundError } from "@/errors";

export const createLot: ServerAction<
  {
    costPrice: number;
    totalQty: number;
    expiresAt?: Date;
    stockId: string;
    tenantId: string;
  },
  void
> = async ({ costPrice, stockId, totalQty, tenantId, expiresAt = null }) => {
  try {
    if (!stockId || !tenantId || totalQty <= 0 || costPrice <= 0) {
      throw new BadRequestError("Invalid input parameters");
    }

    await prisma.$transaction(async (tx) => {
      const stock = await tx.stock.findUnique({
        where: { id: stockId, tenantId },
      });
      if (!stock) throw new NotFoundError("Stock not found");

      await tx.stockLot.create({
        data: {
          stockId,
          lotNumber: generateLotNumber(),
          tenantId,
          costPrice,
          totalQty,
          expiresAt,
        },
      });

      await tx.stock.update({
        where: { id: stockId },
        data: {
          totalQty: { increment: totalQty },
          availableQty: { increment: totalQty },
        },
      });
    });

    return success(undefined);
  } catch (error: unknown) {
    console.error("Failed to create lot:", error);
    return reportError(error);
  }
};

function generateLotNumber(): string {
  return Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0");
}
