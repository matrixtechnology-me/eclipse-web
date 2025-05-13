"use server";

import { CACHE_TAGS } from "@/config/cache-tags";
import { failure, Action, success } from "@/core/action";
import { InternalServerError, NotFoundError } from "@/errors";
import prisma from "@/lib/prisma";
import { EMembershipRole } from "@prisma/client";
import { revalidateTag } from "next/cache";

type CreateTenantActionPayload = {
  name: string;
  description: string;
  userId: string;
};

type CreateTenantActionResult = {
  tenantId: string;
};

export const createTenant: Action<
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

    revalidateTag(CACHE_TAGS.USER(userId).TENANTS);

    return success({ tenantId: tenant.id });
  } catch (error) {
    console.error(error);
    return failure(new InternalServerError("unable to create tenant"));
  }
};
