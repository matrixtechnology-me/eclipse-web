"use server";

import prisma from "@/lib/prisma";
import {
  ServerAction,
  success,
  failure,
  createActionError,
} from "@/core/server-actions";
import { BadRequestError } from "@/errors/http/bad-request.error";

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
      where: { tenantId },
      _sum: { total: true },
    });

    const invoicing = aggregation._sum.total ?? 0;

    return success({ invoicing });
  } catch (error: unknown) {
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
