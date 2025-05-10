"use server";

import prisma from "@/lib/prisma";
import { Action, success, failure } from "@/core/action";
import { BadRequestError } from "@/errors/http/bad-request.error";
import { InternalServerError } from "@/errors";

type GetProductsCountActionPayload = { tenantId: string };

export type GetProductsCountActionResult = {
  count: number;
};

export const getProductsCount: Action<
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
