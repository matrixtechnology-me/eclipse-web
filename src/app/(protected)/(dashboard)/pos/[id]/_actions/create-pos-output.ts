"use server";

import { CACHE_TAGS } from "@/config/cache-tags";
import { failure, Action, success } from "@/lib/action";
import { InternalServerError } from "@/errors";
import prisma from "@/lib/prisma";
import { EPosEventType } from "@prisma/client";
import { revalidateTag } from "next/cache";

type CreatePosEventOutputActionPayload = {
  amount: number;
  description: string;
  posId: string;
  tenantId: string;
};

export const createPosOutputAction: Action<
  CreatePosEventOutputActionPayload,
  unknown
> = async ({ amount, description, posId, tenantId }) => {
  try {
    await prisma.posEventOutput.create({
      data: {
        amount,
        description,
        posEvent: {
          create: {
            type: EPosEventType.Output,
            posId,
          },
        },
      },
    });

    revalidateTag(CACHE_TAGS.TENANT(tenantId).POS.POS(posId).INDEX);

    return success({});
  } catch (error) {
    console.error(error);
    return failure(
      new InternalServerError(
        "cannot create a new pos event entry because error: " + error
      )
    );
  }
};
