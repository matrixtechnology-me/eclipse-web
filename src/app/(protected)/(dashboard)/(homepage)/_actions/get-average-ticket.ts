"use server";

import prisma from "@/lib/prisma";
import {
  ServerAction,
  success,
  failure,
  createActionError,
} from "@/core/server-actions";
import { BadRequestError } from "@/errors/http/bad-request.error";
import { ESaleStatus } from "@prisma/client";

type GetAverageTicketActionPayload = { tenantId: string };

export type GetAverageTicketActionResult = {
  averageTicket: number;
  totalSales: number;
  salesCount: number;
};

export const getAverageTicket: ServerAction<
  GetAverageTicketActionPayload,
  GetAverageTicketActionResult
> = async ({ tenantId }) => {
  try {
    if (!tenantId) {
      throw new BadRequestError("Tenant ID is required");
    }

    const aggregation = await prisma.sale.aggregate({
      where: { tenantId, status: ESaleStatus.Processed },
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
      createActionError(
        500,
        "RegistrationError",
        "Ocorreu um erro durante o registro",
        {
          originalError: error instanceof Error ? error.message : String(error),
        }
      )
    );
  }
};
