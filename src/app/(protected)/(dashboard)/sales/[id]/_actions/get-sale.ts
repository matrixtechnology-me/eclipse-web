"use server";

import { failure, ServerAction, success } from "@/core/server-actions";
import { InternalServerError, NotFoundError } from "@/errors";
import prisma from "@/lib/prisma";

type GetSaleActionPayload = {
  saleId: string;
  tenantId: string;
};

type GetSaleActionResult = {
  sale: {
    id: string;
  };
};

export const getSaleAction: ServerAction<
  GetSaleActionPayload,
  GetSaleActionResult
> = async ({ saleId, tenantId }) => {
  try {
    const sale = await prisma.sale.findUnique({
      where: {
        id: saleId,
        tenantId,
      },
    });

    if (!sale) return failure(new NotFoundError("sale not found"));

    return success({ sale: { id: sale.id } });
  } catch (error) {
    console.error(error);
    return failure(
      new InternalServerError(
        "unable to get sale with id " + saleId + "because error: " + error
      )
    );
  }
};
