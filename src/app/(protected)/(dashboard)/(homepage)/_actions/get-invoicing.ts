"use server";

import prisma from "@/lib/prisma";
import { ServerAction, success, failure } from "@/core/server-actions";
import { reportError } from "@/utils/report-error.util";
import { BadRequestError } from "@/errors/http/bad-request.error";

export const getInvoicing: ServerAction<{ tenantId: string }, number> = async ({
  tenantId,
}) => {
  try {
    if (!tenantId) {
      throw new BadRequestError("Tenant ID is required");
    }

    const aggregation = await prisma.sale.aggregate({
      where: { tenantId },
      _sum: { total: true },
    });

    return success(aggregation._sum.total?.toNumber() || 0);
  } catch (error: unknown) {
    if (error instanceof BadRequestError) {
      return failure(error);
    }
    return reportError(error);
  }
};
