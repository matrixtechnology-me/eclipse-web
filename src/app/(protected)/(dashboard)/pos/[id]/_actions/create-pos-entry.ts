"use server";

import { failure, ServerAction, success } from "@/core/server-actions";
import { InternalServerError } from "@/errors";
import prisma from "@/lib/prisma";
import { EPosEventType } from "@prisma/client";

type CreatePosEventEntryActionPayload = {
  amount: number;
  description: string;
  posId: string;
};

export const createPosEntryAction: ServerAction<
  CreatePosEventEntryActionPayload,
  unknown
> = async ({ amount, description, posId }) => {
  try {
    await prisma.posEventEntry.create({
      data: {
        amount,
        description,
        posEvent: {
          create: {
            type: EPosEventType.Entry,
            posId,
          },
        },
      },
    });

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
