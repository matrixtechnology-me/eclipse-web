"use server";

import { failure, ServerAction, success } from "@/core/server-actions";
import { InternalServerError } from "@/errors";
import prisma from "@/lib/prisma";

type GetPosActionPayload = {
  tenantId: string;
};

type GetPosActionResult = {
  pos: {
    id: string;
    name: string;
    description: string;
  }[];
};

export const getPosAction: ServerAction<
  GetPosActionPayload,
  GetPosActionResult
> = async ({ tenantId }) => {
  try {
    const pos = await prisma.pos.findMany({
      where: {
        tenantId,
      },
    });

    return success({
      pos: pos,
    });
  } catch (error) {
    console.error(error);
    return failure(new InternalServerError("cannot get all pos"));
  }
};
