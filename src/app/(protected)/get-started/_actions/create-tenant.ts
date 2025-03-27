"use server";

import { NotFoundError } from "@/errors/not-found";
import prisma from "@/lib/prisma";
import { ServerAction } from "@/types/server-actions";
import { propagateError } from "@/utils/propagate-error";
import { reportError } from "@/utils/report-error";
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

    return { data: { tenantId: tenant.id } };
  } catch (error: any) {
    const expectedErrors = [NotFoundError.name];
    return expectedErrors.includes(error?.name)
      ? propagateError(error)
      : reportError(error);
  }
};
