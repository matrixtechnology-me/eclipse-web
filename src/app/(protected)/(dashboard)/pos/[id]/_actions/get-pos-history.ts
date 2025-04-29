"use server";

import { failure, ServerAction, success } from "@/core/server-actions";
import { InternalServerError } from "@/errors";
import prisma from "@/lib/prisma";
import { EPosEventType } from "@prisma/client";

type GetPosHistoryActionPayload = {
  posId: string;
};

type Event = {
  id: string;
  type: EPosEventType;
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
> = async ({ posId }) => {
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
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
      };

      switch (event.type) {
        case EPosEventType.Entry:
          if (!event.entry) continue;

          mappedEvents.push({
            ...defaultProps,
            amount: event.entry.amount,
            description: event.entry.description,
          });

          break;
        case EPosEventType.Output:
          if (!event.output) continue;

          mappedEvents.push({
            ...defaultProps,
            amount: event.output.amount,
            description: event.output.description,
          });

          break;
        case EPosEventType.Sale:
          if (!event.sale) continue;

          mappedEvents.push({
            ...defaultProps,
            amount: event.sale.amount,
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
