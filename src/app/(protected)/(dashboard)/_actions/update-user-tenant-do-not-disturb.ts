import { failure, Action, success } from "@/core/action";
import { InternalServerError } from "@/errors";
import prisma from "@/lib/prisma";

type UpdateUserTenantDoNotDisturbActionPayload = {
  userId: string;
  tenantId: string;
};

export const updateUserTenantDoNotDisturbAction: Action<
  UpdateUserTenantDoNotDisturbActionPayload
> = async ({ userId, tenantId }) => {
  try {
    const userTenantSettings = await prisma.userTenantSettings.findUnique({
      where: {
        userId_tenantId: { userId, tenantId },
      },
      select: {
        doNotDisturb: true,
      },
    });

    if (!userTenantSettings)
      return failure(new InternalServerError("user-tenant settings not found"));

    await prisma.userTenantSettings.update({
      where: {
        userId_tenantId: { userId, tenantId },
      },
      data: {
        doNotDisturb: !userTenantSettings.doNotDisturb,
      },
    });

    return success({});
  } catch (error) {
    console.error(error);
    return failure(
      new InternalServerError("unable to update do user not disturb property")
    );
  }
};
