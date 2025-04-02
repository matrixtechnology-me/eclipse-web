"use server";

import prisma from "@/lib/prisma";
import { ServerAction, success, failure } from "@/core/server-actions";
import { reportError } from "@/utils/report-error.util";
import { BadRequestError } from "@/errors/http/bad-request.error";

export type AverageTicketResult = {
  averageTicket: number;
  totalSales: number;
  salesCount: number;
};

export const getAverageTicket: ServerAction<
  { tenantId: string },
  AverageTicketResult
> = async ({ tenantId }) => {
  try {
    if (!tenantId) {
      throw new BadRequestError("Tenant ID is required");
    }

    const aggregation = await prisma.sale.aggregate({
      where: { tenantId },
      _sum: {
        total: true,
      },
      _count: true,
    });

    const salesCount = aggregation._count;
    const totalSales = aggregation._sum.total?.toNumber() || 0;
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

    if (error instanceof BadRequestError) {
      return failure(error);
    }

    return reportError(error);
  }
};
