"use server";

import { CACHE_TAGS } from "@/config/cache-tags";
import { failure, Action, success } from "@/lib/action";
import { InternalServerError, NotFoundError } from "@/errors";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";

export type DeletePosActionPayload = {
  posId: string;
  tenantId: string;
};

export const deletePosAction: Action<DeletePosActionPayload> = async ({
  posId,
  tenantId,
}) => {
  try {
    const pos = await prisma.pos.findUnique({
      where: {
        id: posId,
        tenantId,
      },
    });

    if (!pos) return failure(new NotFoundError("PDV não encontrado"));

    await prisma.$transaction(async (tx) => {
      const commonAttributes = {
        deletedAt: new Date(),
      };

      await tx.pos.update({
        where: { id: posId },
        data: { ...commonAttributes },
      });

      const posEvents = await tx.posEvent.findMany({
        where: {
          id: pos.id,
        },
      });

      if (posEvents.length) {
        await tx.posEvent.update({
          where: { id: posId },
          data: {
            ...commonAttributes,
            sale: {
              update: {
                sale: {
                  update: {
                    ...commonAttributes,
                  },
                },
              },
            },
          },
        });
      }
    });

    revalidateTag(CACHE_TAGS.TENANT(tenantId).POS.POS(posId).INDEX);
    revalidateTag(CACHE_TAGS.TENANT(tenantId).POS.INDEX.GENERAL);

    return success({});
  } catch (error) {
    console.error(error);
    return failure(new InternalServerError("Erro ao deletar o PDV: " + error));
  }
};
