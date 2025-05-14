"use server";

import { CACHE_TAGS } from "@/config/cache-tags";
import { failure, Action, success } from "@/lib/action";
import { InternalServerError } from "@/errors";
import prisma from "@/lib/prisma";
import { EStockEventType } from "@prisma/client";
import { unstable_cacheTag as cacheTag } from "next/cache";

type GetStockSummaryActionPayload = {
  stockId: string;
  tenantId: string;
};

type GetStockSummaryActionResult = {
  entriesCount: number;
  outputsCount: number;
  balance: number;
  profitProjection: number;
};

export const getStockSummaryAction: Action<
  GetStockSummaryActionPayload,
  GetStockSummaryActionResult
> = async ({ stockId, tenantId }) => {
  "use cache";

  cacheTag(CACHE_TAGS.TENANT(tenantId).STOCKS.STOCK(stockId).EVENTS);

  try {
    const events = await prisma.stockEvent.findMany({
      where: { stockId, tenantId },
      include: {
        entry: true,
        output: true,
        StockLot: true,
        stock: {
          include: {
            product: true,
          },
        },
      },
    });

    console.log("events", events);

    let entriesCount = 0;
    let outputsCount = 0;
    let balance = 0;
    let profitProjection = 0;

    for (const event of events) {
      console.log(event);

      const { StockLot, stock } = event;

      switch (event.type) {
        case EStockEventType.Entry:
          if (event.entry && StockLot && stock.product?.salePrice) {
            const { quantity } = event.entry;
            const costPrice = StockLot.costPrice.toNumber();
            const salePrice = stock.product.salePrice.toNumber();

            entriesCount += 1;
            balance += quantity * costPrice;
            profitProjection += quantity * (salePrice - costPrice);
          }
          break;

        case EStockEventType.Output:
          if (event.output && StockLot) {
            const { quantity } = event.output;
            const costPrice = StockLot.costPrice.toNumber();

            outputsCount += 1;
            balance -= quantity * costPrice;
          }
          break;

        default:
          continue;
      }
    }

    return success({
      entriesCount,
      outputsCount,
      balance,
      profitProjection,
    });
  } catch (error) {
    console.log(error);
    return failure(
      new InternalServerError("Erro ao obter resumo de eventos: " + error)
    );
  }
};
