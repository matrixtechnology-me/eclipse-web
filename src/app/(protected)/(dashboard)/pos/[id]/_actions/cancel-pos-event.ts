"use server";

import { CACHE_TAGS } from "@/config/cache-tags";
import { failure, Action, success } from "@/core/action";
import { InternalServerError, NotFoundError } from "@/errors";
import prisma from "@/lib/prisma";
import { EPosEventStatus, EPosEventType, ESaleStatus } from "@prisma/client";
import { revalidateTag } from "next/cache";

type CancelPosEventActionPayload = {
  tenantId: string;
  posId: string;
  posEventId: string;
};

export const cancelPosEventAction: Action<
  CancelPosEventActionPayload
> = async ({ posEventId, posId, tenantId }) => {
  try {
    const posEvent = await prisma.posEvent.findUnique({
      where: {
        id: posEventId,
      },
      include: {
        sale: {
          select: {
            saleId: true,
          },
        },
      },
    });

    if (!posEvent) return failure(new NotFoundError("pos event not found"));

    await prisma.posEvent.update({
      where: {
        id: posEvent.id,
      },
      data: {
        status: EPosEventStatus.Canceled,
      },
    });

    if (posEvent.type === EPosEventType.Sale) {
      if (!posEvent.sale)
        return failure(new InternalServerError("no associated sales"));

      const sale = await prisma.sale.findUnique({
        where: {
          id: posEvent.sale.saleId,
        },
      });

      if (!sale) return failure(new NotFoundError("sale not found"));

      await prisma.sale.update({
        where: {
          id: sale.id,
        },
        data: {
          status: ESaleStatus.Canceled,
        },
      });
    }

    revalidateTag(CACHE_TAGS.TENANT(tenantId).POS.POS(posId).INDEX);

    return success({});
  } catch (error) {
    console.error(error);
    return failure(
      new InternalServerError("unable to cancel event because error " + error)
    );
  }
};
