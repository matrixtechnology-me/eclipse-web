"use server";

import { BadRequestError, InternalServerError } from "@/errors";
import { Action, failure, success } from "@/lib/action";
import prisma from "@/lib/prisma";
import { EMembershipRole } from "@prisma/client";

type GetTenantsActionPayload = {
  userId: string;
  tenantId: string;
  productId: string;
};

type GetTenantsActionResult = {
  tenants: {
    id: string;
    name: string;
  }[];
};

export const getTenants: Action<
  GetTenantsActionPayload,
  GetTenantsActionResult
> = async ({ tenantId, userId, productId }) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) return failure(new BadRequestError("User not found"));

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) return failure(new BadRequestError("Product not found"));

    const currentTenant = await prisma.tenant.findUnique({
      where: {
        id: tenantId,
        memberships: {
          some: {
            membership: {
              userId,
            },
          },
        },
      },
      select: {
        memberships: {
          where: {
            membership: {
              role: EMembershipRole.Owner,
            },
          },
          select: {
            membership: true,
          },
        },
      },
    });

    if (!currentTenant) {
      return failure(new BadRequestError("Tenant not found"));
    }

    const currentTenantOwner = currentTenant.memberships?.[0];

    if (!currentTenantOwner) {
      return failure(
        new BadRequestError("Current tenant does not have an owner")
      );
    }

    const elebigleTenants = await prisma.tenant.findMany({
      where: {
        memberships: {
          some: {
            membership: {
              userId: currentTenantOwner.membership.id,
              role: currentTenantOwner.membership.role,
            },
          },
        },
        products: {
          some: {
            barCode: product.barCode,
          },
        },
      },
    });

    return success({
      tenants: elebigleTenants,
    });
  } catch (error) {
    return failure(
      new InternalServerError(
        "Unable to get tenants to fill in elebigle tenants for transfer"
      )
    );
  }
};
