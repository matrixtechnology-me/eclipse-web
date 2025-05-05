"use server";

import { CACHE_TAGS } from "@/config/cache-tags";
import { failure, ServerAction, success } from "@/core/server-actions";
import { InternalServerError } from "@/errors";
import prisma from "@/lib/prisma";
import { EPosEventStatus, EPosEventType } from "@prisma/client";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

type GetPosHistoryActionPayload = {
  posId: string;
  tenantId: string;
};

type Event = {
  id: string;
  type: EPosEventType;
  status: EPosEventStatus;
  amount: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

type GetPosHistoryActionResult = {
  events: Event[];
};

export const getPosHistoryAction: ServerAction<
  GetPosHistoryActionPayload,
  GetPosHistoryActionResult
> = async ({ posId, tenantId }) => {
  "use cache";
  cacheTag(CACHE_TAGS.TENANT(tenantId).POS.POS(posId).INDEX);

  try {
    const events = await prisma.posEvent.findMany({
      where: {
        posId,
      },
      include: {
        entry: true,
        output: true,
        sale: true,
      },
    });

    const mappedEvents: Event[] = [];

    for (const event of events) {
      const defaultProps = {
        id: event.id,
        type: event.type,
        status: event.status,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
      };

      switch (event.type) {
        case EPosEventType.Entry:
          if (!event.entry) continue;

          mappedEvents.push({
            ...defaultProps,
            amount: event.entry.amount.toNumber(),
            description: event.entry.description,
          });

          break;
        case EPosEventType.Output:
          if (!event.output) continue;

          mappedEvents.push({
            ...defaultProps,
            amount: event.output.amount.toNumber(),
            description: event.output.description,
          });

          break;
        case EPosEventType.Sale:
          if (!event.sale) continue;

          mappedEvents.push({
            ...defaultProps,
            amount: event.sale.amount.toNumber(),
            description: event.sale.description,
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
        "cannot retrieve POS history due to error: " + error
      )
    );
  }
};
