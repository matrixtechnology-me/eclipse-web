"use server";

import { CACHE_TAGS } from "@/config/cache-tags";
import { failure, Action, success } from "@/core/action";
import { InternalServerError } from "@/errors";
import prisma from "@/lib/prisma";
import { EStockEventType } from "@prisma/client";
import { unstable_cacheTag as cacheTag } from "next/cache";

type GetStockHistoryActionPayload = {
  stockId: string;
  tenantId: string;
};

type StockEvent = {
  id: string;
  type: EStockEventType;
  quantity: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

type GetStockHistoryActionResult = {
  events: StockEvent[];
};

export const getStockHistoryAction: Action<
  GetStockHistoryActionPayload,
  GetStockHistoryActionResult
> = async ({ stockId, tenantId }) => {
  "use cache";

  cacheTag(CACHE_TAGS.TENANT(tenantId).STOCKS.STOCK(stockId).EVENTS);

  try {
    const events = await prisma.stockEvent.findMany({
      where: {
        stockId,
        tenantId,
      },
      include: {
        entry: true,
        output: true,
      },
    });

    const mappedEvents: StockEvent[] = [];

    for (const event of events) {
      const defaultProps = {
        id: event.id,
        type: event.type,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
      };

      switch (event.type) {
        case EStockEventType.Entry:
          if (!event.entry) continue;

          mappedEvents.push({
            ...defaultProps,
            quantity: event.entry.quantity,
            description: event.entry.description,
          });

          break;
        case EStockEventType.Output:
          if (!event.output) continue;

          mappedEvents.push({
            ...defaultProps,
            quantity: event.output.quantity,
            description: event.output.description,
          });

          break;
        default:
          continue;
      }
    }

    return success({
      events: mappedEvents,
    });
  } catch (error) {
    console.log(error);
    return failure(
      new InternalServerError(
        "cannot retrieve stock history due to error: " + error
      )
    );
  }
};
