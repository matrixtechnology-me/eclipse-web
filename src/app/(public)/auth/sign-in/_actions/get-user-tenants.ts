"use server";

import { NotFoundError } from "@/errors/http/not-found.error";
import prisma from "@/lib/prisma";
import { ServerAction, success, failure } from "@/core/server-actions";
import { InternalServerError } from "@/errors";

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
  { tenants: Tenant[] }
> = async ({ userId }) => {
  try {
    if (!userId) {
      throw new NotFoundError("User ID is required");
    }

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

    return success({
      tenants: tenants.map((tenant) => ({
        id: tenant.id,
        name: tenant.name,
        description: tenant.description ?? "",
        active: Boolean(tenant.active),
        createdAt: tenant.createdAt,
        updatedAt: tenant.updatedAt,
      })),
    });
  } catch (error: unknown) {
    console.error(`Failed to fetch tenants for user ${userId}:`, error);
    return failure(new InternalServerError());
  }
};
