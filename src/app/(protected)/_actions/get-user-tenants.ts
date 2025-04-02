"use server";

import { NotFoundError } from "@/errors/http/not-found.error";
import prisma from "@/lib/prisma";
import { ServerAction, success, failure } from "@/core/server-actions";
import { reportError } from "@/utils/report-error.util";

export type Tenant = {
  id: string;
  name: string;
  description: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export const getUserTenants: ServerAction<
  { userId: string },
  Tenant[]
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
        active: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    if (!tenants.length) {
      return failure(new NotFoundError("No tenants found for this user"));
    }

    return success(
      tenants.map((tenant) => ({
        ...tenant,
        description: tenant.description ?? "",
        active: Boolean(tenant.active),
      }))
    );
  } catch (error: unknown) {
    console.error(`Failed to get tenants for user ${userId}:`, error);
    return reportError(error);
  }
};
