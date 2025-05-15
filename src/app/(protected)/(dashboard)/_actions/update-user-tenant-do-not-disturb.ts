"use server";

import { failure, Action, success } from "@/lib/action";
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
    const existingSettings = await prisma.userTenantSettings.findUnique({
      where: {
        userId_tenantId: { userId, tenantId },
      },
      select: {
        doNotDisturb: true,
      },
    });

    const newDoNotDisturb = existingSettings
      ? !existingSettings.doNotDisturb
      : true;

    await prisma.userTenantSettings.upsert({
      where: {
        userId_tenantId: { userId, tenantId },
      },
      update: {
        doNotDisturb: newDoNotDisturb,
      },
      create: {
        userId,
        tenantId,
        doNotDisturb: newDoNotDisturb,
      },
    });

    return success({});
  } catch (error) {
    console.error(error);
    return failure(
      new InternalServerError("unable to update do not disturb setting")
    );
  }
};
