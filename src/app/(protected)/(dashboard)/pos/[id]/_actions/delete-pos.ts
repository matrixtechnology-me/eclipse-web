"use server";

import { CACHE_TAGS } from "@/config/cache-tags";
import { failure, Action, success } from "@/lib/action";
import { InternalServerError, NotFoundError } from "@/errors";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { EPosEventType } from "@prisma/client";

type DeletePosActionPayload = {
  posId: string;
  tenantId: string;
};

export const deletePosAction: Action<DeletePosActionPayload> = async ({
  posId,
  tenantId,
}) => {
  const softDeleteData = {
    deletedAt: new Date(),
  };

  try {
    const pos = await prisma.pos.findUnique({
      where: {
        id: posId,
        tenantId,
      },
    });

    if (!pos) {
      return failure(new NotFoundError("PDV não encontrado"));
    }

    await prisma.$transaction(async (tx) => {
      await tx.pos.update({
        where: { id: posId },
        data: softDeleteData,
      });

      const posEvents = await tx.posEvent.findMany({
        where: { posId: pos.id },
        include: {
          sale: {
            select: {
              sale: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });

      await tx.posEvent.updateMany({
        where: { posId: pos.id },
        data: softDeleteData,
      });

      const saleIds = posEvents
        .filter((pe) => pe.type === EPosEventType.Sale)
        .map((pe) => pe.sale!.sale.id);

      if (saleIds.length > 0) {
        await tx.sale.updateMany({
          where: { id: { in: saleIds } },
          data: softDeleteData,
        });
      }
    });

    revalidateTag(CACHE_TAGS.TENANT(tenantId).POS.POS(posId).INDEX);
    revalidateTag(CACHE_TAGS.TENANT(tenantId).POS.INDEX.ALL);
    revalidateTag(CACHE_TAGS.TENANT(tenantId).SALES.INDEX.ALL);

    return success({});
  } catch (error) {
    console.error("Failed to delete POS:", error);
    return failure(
      new InternalServerError(
        `Erro ao deletar o PDV: ${
          error instanceof Error ? error.message : String(error)
        }`
      )
    );
  }
};
