"use server";

import prisma from "@/lib/prisma";
import { failure, Action, success } from "@/lib/action";
import { BadRequestError, InternalServerError, NotFoundError } from "@/errors";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/cache-tags";
import { EStockEventType } from "@prisma/client";
import { CurrencyFormatter } from "@/utils/formatters/currency";

export const createLotAction: Action<
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

      const generatedLotNumber = generateLotNumber();

      await tx.stockLot.create({
        data: {
          stockId,
          lotNumber: generatedLotNumber,
          tenantId,
          costPrice,
          totalQty,
          expiresAt,
        },
      });

      const stockEvent = await tx.stockEvent.create({
        data: {
          type: EStockEventType.Entry,
          stockId,
          tenantId,
          description: `Lote ${generatedLotNumber} chegou! 🎉 São ${totalQty} unidades a caminho. Custo: ${CurrencyFormatter.format(
            costPrice
          )}. Vamos vender!`,
        },
      });

      await tx.stockEventEntry.create({
        data: {
          id: stockEvent.id,
          quantity: totalQty,
          description: `Lote ${generatedLotNumber.toUpperCase()} chegou! 🎉 São ${totalQty} unidades a caminho. Custo: ${CurrencyFormatter.format(
            costPrice
          )}. Vamos vender!`,
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

    revalidateTag(CACHE_TAGS.TENANT(tenantId).STOCKS.STOCK(stockId).EVENTS);
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
