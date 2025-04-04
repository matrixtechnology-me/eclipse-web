"use server";

import prisma from "@/lib/prisma";
import {
  ServerAction,
  success,
  failure,
  createActionError,
} from "@/core/server-actions";
import { BadRequestError } from "@/errors/http/bad-request.error";

type GetCustomersCountActionPayload = { tenantId: string };

export type GetCustomersCountActionResult = { count: number };

export const getCustomersCount: ServerAction<
  GetCustomersCountActionPayload,
  GetCustomersCountActionResult
> = async ({ tenantId }) => {
  try {
    if (!tenantId) {
      throw new BadRequestError("Tenant ID is required");
    }

    const count = await prisma.customer.count({
      where: { tenantId },
    });

    return success({ count });
  } catch (error: unknown) {
    console.error(
      `Failed to get customer count for tenant ${tenantId}:`,
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
