"use server";

import prisma from "@/lib/prisma";
import { Action, success, failure } from "@/core/action";
import { BadRequestError } from "@/errors/http/bad-request.error";
import { ESaleStatus } from "@prisma/client";
import { InternalServerError } from "@/errors";

type GetAverageTicketActionPayload = { tenantId: string };

export type GetAverageTicketActionResult = {
  averageTicket: number;
  totalSales: number;
  salesCount: number;
};

export const getAverageTicket: Action<
  GetAverageTicketActionPayload,
  GetAverageTicketActionResult
> = async ({ tenantId }) => {
  try {
    if (!tenantId) {
      throw new BadRequestError("Tenant ID is required");
    }

    const aggregation = await prisma.sale.aggregate({
      where: { tenantId, status: ESaleStatus.Processed, deletedAt: null },
      _sum: {
        total: true,
      },
      _count: true,
    });

    const salesCount = aggregation._count;
    const totalSales = aggregation._sum.total?.toNumber() ?? 0;
    const averageTicket = salesCount > 0 ? totalSales / salesCount : 0;

    return success({
      averageTicket,
      totalSales,
      salesCount,
    });
  } catch (error: unknown) {
    console.error(
      `Failed to calculate average ticket for tenant ${tenantId}:`,
      error
    );

    return failure(
      new InternalServerError(
        `failed to calculate average ticket for tenant ${tenantId}`
      )
    );
  }
};
