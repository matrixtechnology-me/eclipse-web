"use server";

import prisma from "@/lib/prisma";
import { ServerAction, success, failure } from "@/core/server-actions";
import { BadRequestError } from "@/errors/http/bad-request.error";
import { ESaleStatus } from "@prisma/client";
import { InternalServerError } from "@/errors";

type GetInvoicingActionPayload = { tenantId: string };

export type GetInvoicingActionResult = {
  invoicing: number;
};

export const getInvoicing: ServerAction<
  GetInvoicingActionPayload,
  GetInvoicingActionResult
> = async ({ tenantId }) => {
  try {
    if (!tenantId) {
      throw new BadRequestError("Tenant ID is required");
    }

    const aggregation = await prisma.sale.aggregate({
      where: { tenantId, status: ESaleStatus.Processed },
      _sum: { total: true },
    });

    const invoicing = aggregation._sum.total?.toNumber() ?? 0;

    return success({ invoicing });
  } catch (error: unknown) {
    return failure(
      new InternalServerError(`failed to get invoicing for tenant ${tenantId}`)
    );
  }
};
