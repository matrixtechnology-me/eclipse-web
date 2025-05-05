"use server";

import { CACHE_TAGS } from "@/config/cache-tags";
import { failure, ServerAction, success } from "@/core/server-actions";
import { InternalServerError, NotFoundError } from "@/errors";
import prisma from "@/lib/prisma";
import { EPosStatus } from "@prisma/client";
import { revalidateTag } from "next/cache";

type UpdatePosStatusActionPayload = {
  posId: string;
  tenantId: string;
  status: EPosStatus;
};

export const updatePosStatusAction: ServerAction<
  UpdatePosStatusActionPayload
> = async ({ posId, tenantId, status }) => {
  try {
    const pos = await prisma.pos.findUnique({
      where: {
        id: posId,
        tenantId,
      },
    });

    if (!pos) return failure(new NotFoundError("pos not found"));

    await prisma.pos.update({
      where: {
        id: posId,
      },
      data: {
        status,
      },
    });

    revalidateTag(CACHE_TAGS.TENANT(tenantId).POS.POS(posId).INDEX);

    return success({});
  } catch (error) {
    console.error(error);
    return failure(
      new InternalServerError(
        "unable to change pos status because error " + error
      )
    );
  }
};
