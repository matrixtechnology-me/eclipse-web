"use server";

import prisma from "@/lib/prisma";
import { Action, success, failure } from "@/core/action";
import { BadRequestError } from "@/errors/http/bad-request.error";
import { InternalServerError } from "@/errors";

type GetCustomersCountActionPayload = { tenantId: string };

export type GetCustomersCountActionResult = { count: number };

export const getCustomersCount: Action<
  GetCustomersCountActionPayload,
  GetCustomersCountActionResult
> = async ({ tenantId }) => {
  try {
    if (!tenantId) {
      throw new BadRequestError("Tenant ID is required");
    }

    const count = await prisma.customer.count({
      where: { tenantId, deletedAt: null },
    });

    return success({ count });
  } catch (error: unknown) {
    console.error(
      `Failed to get customer count for tenant ${tenantId}:`,
      error
    );

    return failure(
      new InternalServerError(
        `failed to get customer count for tenant ${tenantId}`
      )
    );
  }
};
