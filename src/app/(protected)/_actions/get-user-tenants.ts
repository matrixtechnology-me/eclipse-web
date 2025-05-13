"use server";

import { NotFoundError } from "@/errors/http/not-found.error";
import prisma from "@/lib/prisma";
import { Action, success, failure } from "@/core/action";
import { InternalServerError } from "@/errors";
import { unstable_cacheTag as cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/config/cache-tags";

export type Tenant = {
  id: string;
  name: string;
  description: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export const getUserTenants: Action<
  { userId: string },
  { tenants: Tenant[] }
> = async ({ userId }) => {
  "use cache";
  cacheTag(CACHE_TAGS.USER(userId).TENANTS);

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

    return success({
      tenants: tenants.map((tenant) => ({
        ...tenant,
        description: tenant.description ?? "",
        active: Boolean(tenant.active),
      })),
    });
  } catch (error: unknown) {
    console.error(`Failed to get tenants for user ${userId}:`, error);
    return failure(new InternalServerError());
  }
};
