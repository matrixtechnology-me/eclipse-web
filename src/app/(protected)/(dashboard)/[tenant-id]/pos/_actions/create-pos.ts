"use server";

import { failure, Action, success } from "@/core/action";
import { InternalServerError } from "@/errors";
import prisma from "@/lib/prisma";

type CreatePosActionPayload = {
  name: string;
  description: string;
  tenantId: string;
};

type CreatePosActionResult = {
  posId: string;
};

export const createPosAction: Action<
  CreatePosActionPayload,
  CreatePosActionResult
> = async ({ description, name, tenantId }) => {
  try {
    const pos = await prisma.pos.create({
      data: {
        name,
        description,
        tenantId,
      },
    });

    return success({ posId: pos.id });
  } catch (error) {
    console.error(error);
    return failure(
      new InternalServerError("cannot create a new pos because error: " + error)
    );
  }
};
