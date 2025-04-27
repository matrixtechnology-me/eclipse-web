"use server";

import {
  createActionError,
  failure,
  ServerAction,
  success,
} from "@/core/server-actions";
import { NotFoundError } from "@/errors";
import prisma from "@/lib/prisma";
import { propagateError } from "@/utils/propagate-error.util";
import { reportError } from "@/utils/report-error.util";
import { EMembershipRole } from "@prisma/client";

type CreateTenantActionPayload = {
  name: string;
  description: string;
  userId: string;
};

type CreateTenantActionResult = {
  tenantId: string;
};

export const createTenant: ServerAction<
  CreateTenantActionPayload,
  CreateTenantActionResult
> = async ({ description, name, userId }) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundError("user not found");

    const tenant = await prisma.tenant.create({
      data: {
        name,
        description,
        memberships: {
          create: {
            membership: {
              create: {
                role: EMembershipRole.Owner,
                userId,
              },
            },
          },
        },
      },
    });

    return success({ tenantId: tenant.id });
  } catch (error) {
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
