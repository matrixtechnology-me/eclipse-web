"use server";

import prisma from "@/lib/prisma";
import { Action, success, failure } from "@/lib/action";
import { BadRequestError } from "@/errors/http/bad-request.error";
import { ESaleStatus } from "@prisma/client";
import { InternalServerError } from "@/errors";

type GetInvoicingActionPayload = { tenantId: string };

export type GetInvoicingActionResult = {
  invoicing: number;
};

export const getInvoicing: Action<
  GetInvoicingActionPayload,
  GetInvoicingActionResult
> = async ({ tenantId }) => {
  try {
    if (!tenantId) {
      throw new BadRequestError("Tenant ID is required");
    }

    const aggregation = await prisma.sale.aggregate({
      where: { tenantId, status: ESaleStatus.Processed, deletedAt: null },
      _sum: { paidTotal: true },
    });

    const invoicing = aggregation._sum.paidTotal?.toNumber() ?? 0;

    return success({ invoicing });
  } catch (error: unknown) {
    console.error(error);
    return failure(
      new InternalServerError(`failed to get invoicing for tenant ${tenantId}`)
    );
  }
};
