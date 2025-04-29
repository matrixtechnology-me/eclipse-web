"use server";

import { failure, ServerAction, success } from "@/core/server-actions";
import { InternalServerError } from "@/errors";
import prisma from "@/lib/prisma";
import { EPosEventType } from "@prisma/client";

type GetPosSummaryActionPayload = {
  posId: string;
};

type GetPosSummaryActionResult = {
  entriesCount: number;
  outputsCount: number;
  salesCount: number;
  balance: number;
};

export const getPosSummaryAction: ServerAction<
  GetPosSummaryActionPayload,
  GetPosSummaryActionResult
> = async ({ posId }) => {
  try {
    const events = await prisma.posEvent.findMany({
      where: { posId },
      include: {
        entry: true,
        output: true,
        sale: true,
      },
    });

    let entriesCount = 0;
    let outputsCount = 0;
    let salesCount = 0;
    let balance = 0;

    for (const event of events) {
      switch (event.type) {
        case EPosEventType.Entry:
          if (event.entry) {
            entriesCount += 1;
            balance += event.entry.amount;
          }
          break;
        case EPosEventType.Output:
          if (event.output) {
            outputsCount += 1;
            balance -= event.output.amount;
          }
          break;
        case EPosEventType.Sale:
          if (event.sale) {
            salesCount += 1;
            balance += event.sale.amount;
          }
          break;
        default:
          continue;
      }
    }

    return success({
      entriesCount,
      outputsCount,
      salesCount,
      balance,
    });
  } catch (error) {
    console.log(error);
    return failure(
      new InternalServerError("Erro ao obter resumo de eventos: " + error)
    );
  }
};
