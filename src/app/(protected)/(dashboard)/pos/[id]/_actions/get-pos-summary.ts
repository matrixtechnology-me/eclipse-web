"use server";

import { CACHE_TAGS } from "@/config/cache-tags";
import { failure, ServerAction, success } from "@/core/server-actions";
import { InternalServerError } from "@/errors";
import prisma from "@/lib/prisma";
import { EPosEventType } from "@prisma/client";
import { unstable_cacheTag as cacheTag } from "next/cache";

type GetPosSummaryActionPayload = {
  posId: string;
  tenantId: string;
};

type GetPosSummaryActionResult = {
  entries: {
    count: number;
    amount: number;
  };
  outputs: {
    count: number;
    amount: number;
  };
  sales: {
    count: number;
    amount: number;
  };
  balance: number;
};

export const getPosSummaryAction: ServerAction<
  GetPosSummaryActionPayload,
  GetPosSummaryActionResult
> = async ({ posId, tenantId }) => {
  "use cache";
  cacheTag(CACHE_TAGS.TENANT(tenantId).POS.POS(posId).INDEX);

  try {
    const events = await prisma.posEvent.findMany({
      where: { posId },
      include: {
        entry: true,
        output: true,
        sale: true,
      },
    });

    let entries = { count: 0, amount: 0 };
    let outputs = { count: 0, amount: 0 };
    let sales = { count: 0, amount: 0 };
    let balance = 0;

    for (const event of events) {
      switch (event.type) {
        case EPosEventType.Entry:
          if (event.entry) {
            entries.count += 1;
            entries.amount += event.entry.amount.toNumber();
            balance += event.entry.amount.toNumber();
          }
          break;
        case EPosEventType.Output:
          if (event.output) {
            outputs.count += 1;
            outputs.amount += event.output.amount.toNumber();
            balance -= event.output.amount.toNumber();
          }
          break;
        case EPosEventType.Sale:
          if (event.sale) {
            sales.count += 1;
            sales.amount += event.sale.amount.toNumber();
            balance += event.sale.amount.toNumber();
          }
          break;
        default:
          continue;
      }
    }

    return success({
      entries,
      outputs,
      sales,
      balance,
    });
  } catch (error) {
    console.log(error);
    return failure(
      new InternalServerError("Erro ao obter resumo de eventos: " + error)
    );
  }
};
