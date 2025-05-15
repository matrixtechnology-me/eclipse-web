import { InternalServerError, NotFoundError } from "@/errors";
import { Action, failure, success } from "@/lib/action";
import prisma from "@/lib/prisma";

type GetUserTenantSetttingsActionPayload = {
  userId: string;
  tenantId: string;
};

type GetUserTenantSetttingsActionResult = {
  settings: {
    doNotDisturb: boolean;
  };
};

export const getUserTenantSetttings: Action<
  GetUserTenantSetttingsActionPayload,
  GetUserTenantSetttingsActionResult
> = async ({ tenantId, userId }) => {
  try {
    const userTenantSettings = await prisma.userTenantSettings.findUnique({
      where: {
        userId_tenantId: {
          tenantId,
          userId,
        },
      },
    });

    if (!userTenantSettings)
      return failure(new NotFoundError("user tenant settings"));

    return success({
      settings: {
        doNotDisturb: userTenantSettings.doNotDisturb,
      },
    });
  } catch (error) {
    console.error(error);
    return failure(new InternalServerError());
  }
};
