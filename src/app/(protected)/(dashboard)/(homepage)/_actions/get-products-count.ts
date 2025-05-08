"use server";

import prisma from "@/lib/prisma";
import { ServerAction, success, failure } from "@/core/server-actions";
import { BadRequestError } from "@/errors/http/bad-request.error";
import { InternalServerError } from "@/errors";

type GetProductsCountActionPayload = { tenantId: string };

export type GetProductsCountActionResult = {
  count: number;
};

export const getProductsCount: ServerAction<
  GetProductsCountActionPayload,
  GetProductsCountActionResult
> = async ({ tenantId }) => {
  try {
    if (!tenantId) throw new BadRequestError("Tenant ID is required");

    const count = await prisma.product.count({
      where: { tenantId, deletedAt: null },
    });

    return success({ count });
  } catch (error: unknown) {
    console.error(error);
    return failure(
      new InternalServerError(`failed to get products for tenant ${tenantId}`)
    );
  }
};
