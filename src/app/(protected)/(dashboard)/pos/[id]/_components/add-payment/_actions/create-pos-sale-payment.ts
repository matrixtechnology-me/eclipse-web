"use server";

import prisma from "@/lib/prisma";
import { Action, success, failure } from "@/lib/action";
import {
  UnprocessableEntityError,
  InternalServerError,
  BadRequestError,
  UnauthorizedError,
} from "@/errors";
import { EPaymentMethod, ESaleMovementType } from "@prisma/client";

type CreatePosSalePaymentActionPayload = {
  saleId: string;
  amount: number;
  paymentMethod: EPaymentMethod;
  tenantId: string;
};

type CreatePosSalePaymentActionResult = {
  posSaleEventMovementPaymentId: string;
};

export const createPosSalePaymentAction: Action<
  CreatePosSalePaymentActionPayload,
  CreatePosSalePaymentActionResult
> = async ({
  saleId,
  amount,
  paymentMethod,
  tenantId,
}) => {
    if (!tenantId) throw new BadRequestError("Tenant ID is required");

    try {
      const posEventSale = await prisma.posEventSale.findFirst({
        where: { saleId },
        include: { sale: true },
      });

      if (posEventSale == null)
        throw new UnprocessableEntityError("Pos Event Sale does not exist.");

      const sale = posEventSale.sale;

      if (sale.tenantId !== tenantId) throw new UnauthorizedError();

      if (sale.deletedAt != null)
        throw new UnprocessableEntityError("Related Sale is deleted.");

      const [, posEventSaleMovement] = await Promise.all([
        prisma.posEventSale.update({
          where: { id: posEventSale.id },
          data: {
            amount: { increment: amount },
          },
        }),
        prisma.posEventSaleMovement.create({
          data: {
            type: ESaleMovementType.Payment,
            posEventSaleId: posEventSale.id,
            payment: {
              create: {
                amount,
                method: paymentMethod,
              },
            },
          },
          include: { payment: true },
        }),
      ]);

      const posEventSaleMovementPayment = posEventSaleMovement.payment;

      if (posEventSaleMovementPayment == null)
        throw new InternalServerError("Runtime database error.");

      // Updating global Sale records.
      await Promise.all([
        prisma.sale.update({
          where: { id: saleId, deletedAt: null, tenantId },
          data: {
            paidTotal: { increment: amount },
          },
        }),
        prisma.saleMovement.create({
          data: {
            type: ESaleMovementType.Payment,
            saleId: sale.id,
            payment: {
              create: {
                amount,
                method: paymentMethod,
              },
            },
          },
        }),
      ]);

      return success({
        posSaleEventMovementPaymentId: posEventSaleMovementPayment.id,
      });
    } catch (error: unknown) {
      console.error("Failed to create pos sale payment:", error);
      return failure(
        new InternalServerError("Erro ao criar pagamento", {
          originalError: error instanceof Error ? error.message : String(error),
        })
      );
    }
  }
