"use server";

import { NotFoundError } from "@/errors/http/not-found.error";
import prisma from "@/lib/prisma";
import { ServerAction, success, failure } from "@/core/server-actions";
import { InternalServerError } from "@/errors";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/cache-tags";

type UpdateCustomerActiveActionPayload = {
  customerId: string;
  tenantId: string;
  value: boolean;
};

export const updateCustomerActiveAction: ServerAction<
  UpdateCustomerActiveActionPayload,
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
      data: { active: value },
    });

    revalidateTag(
      CACHE_TAGS.TENANT(tenantId).CUSTOMERS.CUSTOMER(customerId).INDEX
    );

    return success(undefined);
  } catch (error: unknown) {
    console.error("Falha ao atualizar status do cliente:", error);
    return failure(
      new InternalServerError(
        "Ocorreu um erro ao atualizar o status do cliente",
        {
          originalError: error instanceof Error ? error.message : String(error),
        }
      )
    );
  }
};
