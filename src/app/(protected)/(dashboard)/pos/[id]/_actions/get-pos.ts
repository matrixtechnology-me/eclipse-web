import { CACHE_TAGS } from "@/config/cache-tags";
import { failure, Action, success } from "@/lib/action";
import { InternalServerError, NotFoundError } from "@/errors";
import prisma from "@/lib/prisma";
import { EPosStatus } from "@prisma/client";
import { unstable_cacheTag as cacheTag } from "next/cache";

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

export const getPosAction: Action<
  GetPosActionPayload,
  GetPosActionResult
> = async ({ posId, tenantId }) => {
  "use cache";
  cacheTag(CACHE_TAGS.TENANT(tenantId).POS.POS(posId).INDEX);

  try {
    const pos = await prisma.pos.findUnique({
      where: {
        id: posId,
        deletedAt: null,
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
