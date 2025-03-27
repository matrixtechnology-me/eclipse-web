"use server";

import { NotFoundError } from "@/errors/not-found";
import prisma from "@/lib/prisma";
import { ServerAction } from "@/types/server-actions";
import { propagateError } from "@/utils/propagate-error";
import { reportError } from "@/utils/report-error";

export type Tenant = {
  id: string;
  name: string;
  description: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type GetUserTenantsActionPayload = {
  userId: string;
};

type GetUserTenantsActionResult = {
  tenants: Tenant[];
};

export const getUserTenants: ServerAction<
  GetUserTenantsActionPayload,
  GetUserTenantsActionResult
> = async ({ userId }) => {
  try {
    const tenants = await prisma.tenant.findMany({
      where: {
        memberships: {
          some: {
            membership: {
              userId,
            },
          },
        },
      },
    });

    if (!tenants?.length) throw new NotFoundError("tenants not found");

    return {
      data: {
        tenants: tenants.map((tenant) => ({
          id: tenant.id,
          name: tenant.name,
          description: tenant.description ?? "",
          active: Boolean(tenant.active),
          createdAt: tenant.createdAt,
          updatedAt: tenant.updatedAt,
        })),
      },
    };
  } catch (error: any) {
    const expectedErrors = [NotFoundError.name];
    return expectedErrors.includes(error?.name)
      ? propagateError(error)
      : reportError(error);
  }
};
