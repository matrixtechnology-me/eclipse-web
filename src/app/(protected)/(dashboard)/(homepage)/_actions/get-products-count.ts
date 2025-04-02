"use server";

import prisma from "@/lib/prisma";
import { ServerAction, success, failure } from "@/core/server-actions";
import { reportError } from "@/utils/report-error.util";
import { BadRequestError } from "@/errors/http/bad-request.error";

export const getProductsCount: ServerAction<
  { tenantId: string },
  number
> = async ({ tenantId }) => {
  try {
    if (!tenantId) throw new BadRequestError("Tenant ID is required");

    const count = await prisma.product.count({
      where: { tenantId },
    });

    return success(count);
  } catch (error: unknown) {
    if (error instanceof BadRequestError) return failure(error);
    return reportError(error);
  }
};
