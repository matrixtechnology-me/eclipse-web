"use server";

import { failure, ServerAction, success } from "@/core/server-actions";
import { InternalServerError } from "@/errors";
import prisma from "@/lib/prisma";
import { EPosEventType, EPosStatus, Prisma } from "@prisma/client";

type GetPosActionPayload = {
  tenantId: string;
  page: number;
  pageSize: number;
  query: string;
};

type GetPosActionResult = {
  pos: {
    id: string;
    name: string;
    description: string;
    status: EPosStatus;
    createdAt: Date;
    updatedAt: Date;
    summary: {
      entries: { count: number; amount: number };
      outputs: { count: number; amount: number };
      sales: { count: number; amount: number };
      balance: number;
    };
  }[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
};

export const getPosAction: ServerAction<
  GetPosActionPayload,
  GetPosActionResult
> = async ({ tenantId, page, pageSize, query }) => {
  try {
    const skip = (page - 1) * pageSize;

    const whereCondition: Prisma.PosWhereInput = {
      tenantId,
      OR: [
        {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    };

    const [posList, totalCount] = await Promise.all([
      prisma.pos.findMany({
        where: whereCondition,
        skip,
        take: pageSize,
        orderBy: { name: "asc" },
      }),
      prisma.pos.count({ where: whereCondition }),
    ]);

    const data = await Promise.all(
      posList.map(async (pos) => {
        const events = await prisma.posEvent.findMany({
          where: { posId: pos.id },
          include: {
            entry: true,
            output: true,
            sale: true,
          },
        });

        const summary = events.reduce(
          (acc, event) => {
            switch (event.type) {
              case EPosEventType.Entry:
                if (event.entry) {
                  acc.entries.count += 1;
                  acc.entries.amount += event.entry.amount.toNumber();
                }
                break;
              case EPosEventType.Output:
                if (event.output) {
                  acc.outputs.count += 1;
                  acc.outputs.amount += event.output.amount.toNumber();
                }
                break;
              case EPosEventType.Sale:
                if (event.sale) {
                  acc.sales.count += 1;
                  acc.sales.amount += event.sale.amount.toNumber();
                }
                break;
            }
            return acc;
          },
          {
            entries: { count: 0, amount: 0 },
            outputs: { count: 0, amount: 0 },
            sales: { count: 0, amount: 0 },
            balance: 0,
          }
        );

        summary.balance =
          summary.entries.amount -
          summary.outputs.amount +
          summary.sales.amount;

        return {
          id: pos.id,
          name: pos.name,
          description: pos.description,
          status: pos.status,
          createdAt: pos.createdAt,
          updatedAt: pos.updatedAt,
          summary,
        };
      })
    );

    return success({
      pos: data,
      pagination: {
        currentPage: page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error) {
    console.error(error);
    return failure(
      new InternalServerError("Ocorreu um erro ao buscar os pontos de venda", {
        originalError: error instanceof Error ? error.message : String(error),
      })
    );
  }
};
