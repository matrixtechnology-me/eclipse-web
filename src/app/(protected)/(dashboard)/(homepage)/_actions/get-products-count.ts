"use server";

import prisma from "@/lib/prisma";
import {
  ServerAction,
  success,
  failure,
  createActionError,
} from "@/core/server-actions";
import { BadRequestError } from "@/errors/http/bad-request.error";

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
      where: { tenantId },
    });

    return success({ count });
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
