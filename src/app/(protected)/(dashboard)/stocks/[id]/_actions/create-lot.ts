"use server";

import prisma from "@/lib/prisma";
import { failure, ServerAction, success } from "@/core/server-actions";
import { BadRequestError, InternalServerError, NotFoundError } from "@/errors";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/cache-tags";

export const createLotAction: ServerAction<
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

    revalidateTag(CACHE_TAGS.TENANT(tenantId).STOCKS.STOCK(stockId).LOTS);

    return success(undefined);
  } catch (error: unknown) {
    console.error("Failed to create lot:", error);
    return failure(new InternalServerError());
  }
};

function generateLotNumber(): string {
  return Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0");
}
