"use server";

import { NotFoundError } from "@/errors/http/not-found.error";
import prisma from "@/lib/prisma";
import { ServerAction, success, failure } from "@/core/server-actions";
import { InternalServerError } from "@/errors";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/cache-tags";

type UpdateCustomerPhoneNumberActionPayload = {
  customerId: string;
  tenantId: string;
  value: string;
};

export const updateCustomerPhoneNumberAction: ServerAction<
  UpdateCustomerPhoneNumberActionPayload,
  void
> = async ({ value, customerId, tenantId }) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId, tenantId },
    });

    if (!customer) {
      return failure(new NotFoundError("Cliente não encontrado"));
    }

    await prisma.customer.update({
      where: { id: customerId },
      data: { phoneNumber: value },
    });

    revalidateTag(
      CACHE_TAGS.TENANT(tenantId).CUSTOMERS.CUSTOMER(customerId).INDEX
    );

    return success(undefined);
  } catch (error: unknown) {
    console.error("Falha ao atualizar número de telefone:", error);
    return failure(
      new InternalServerError(
        "Ocorreu um erro ao atualizar o número de telefone",
        {
          originalError: error instanceof Error ? error.message : String(error),
        }
      )
    );
  }
};
