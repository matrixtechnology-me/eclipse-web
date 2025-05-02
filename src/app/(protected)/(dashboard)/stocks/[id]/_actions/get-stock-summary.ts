"use server";

import { CACHE_TAGS } from "@/config/cache-tags";
import { failure, ServerAction, success } from "@/core/server-actions";
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
};

export const getStockSummaryAction: ServerAction<
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
      },
    });

    let entriesCount = 0;
    let outputsCount = 0;
    let balance = 0;

    for (const event of events) {
      switch (event.type) {
        case EStockEventType.Entry:
          if (event.entry) {
            entriesCount += 1;
            balance += event.entry.quantity;
          }
          break;
        case EStockEventType.Output:
          if (event.output) {
            outputsCount += 1;
            balance -= event.output.quantity;
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
    });
  } catch (error) {
    console.log(error);
    return failure(
      new InternalServerError("Erro ao obter resumo de eventos: " + error)
    );
  }
};
