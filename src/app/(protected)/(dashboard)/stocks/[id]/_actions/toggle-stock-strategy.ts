"use server";

import { CACHE_TAGS } from "@/config/cache-tags";
import { failure, ServerAction, success } from "@/core/server-actions";
import { InternalServerError, NotFoundError } from "@/errors";
import prisma from "@/lib/prisma";
import { EStockStrategy } from "@prisma/client";
import { revalidateTag } from "next/cache";

type ToggleStockStrategyActionPayload = {
  tenantId: string;
  stockId: string;
};

export const toggleStockStrategyAction: ServerAction<
  ToggleStockStrategyActionPayload
> = async ({ stockId, tenantId }) => {
  try {
    const stock = await prisma.stock.findUnique({
      where: {
        id: stockId,
        tenantId,
      },
    });

    if (!stock) return failure(new NotFoundError("stock not found"));

    await prisma.stock.update({
      where: {
        id: stockId,
      },
      data: {
        strategy:
          stock.strategy === EStockStrategy.Fifo
            ? EStockStrategy.Lifo
            : EStockStrategy.Fifo,
      },
    });

    revalidateTag(CACHE_TAGS.TENANT(tenantId).STOCKS.STOCK(stockId).INDEX);

    return success({});
  } catch (error) {
    console.error(error);
    return failure(new InternalServerError("unable to update stock strategy"));
  }
};
