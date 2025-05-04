import { failure, ServerAction, success } from "@/core/server-actions";
import { InternalServerError, NotFoundError } from "@/errors";
import prisma from "@/lib/prisma";
import { EPosStatus } from "@prisma/client";

type GetPosActionPayload = {
  posId: string;
  tenantId: string;
};

type GetPosActionResult = {
  pos: {
    id: string;
    status: EPosStatus;
  };
};

export const getPosAction: ServerAction<
  GetPosActionPayload,
  GetPosActionResult
> = async ({ posId, tenantId }) => {
  try {
    const pos = await prisma.pos.findUnique({
      where: {
        id: posId,
        tenantId,
      },
    });

    if (!pos) return failure(new NotFoundError("pos not found"));

    return success({
      pos: {
        id: pos.id,
        status: pos.status,
      },
    });
  } catch (error) {
    console.error(error);
    return failure(
      new InternalServerError(
        "unable to change pos status because error " + error
      )
    );
  }
};
