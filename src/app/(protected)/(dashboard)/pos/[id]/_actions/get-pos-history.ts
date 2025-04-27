"use server";

import { failure, ServerAction, success } from "@/core/server-actions";
import { InternalServerError } from "@/errors";
import prisma from "@/lib/prisma";
import { EPosEventType } from "@prisma/client";

type GetPosHistoryActionPayload = {
  posId: string;
};

type Event = {
  type: EPosEventType;
  amount: number;
  description: string;
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
      },
    });

    const mappedEvents = [];

    for (const event of events) {
      switch (event.type) {
        case EPosEventType.Entry:
          if (!event.entry) continue;

          mappedEvents.push({
            amount: event.entry.amount,
            description: event.entry.description,
            type: event.type,
          });

          break;
        case EPosEventType.Output:
          if (!event.output) continue;

          mappedEvents.push({
            amount: event.output.amount,
            description: event.output.description,
            type: event.type,
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
        "cannot create a new pos entry because error: " + error
      )
    );
  }
};
