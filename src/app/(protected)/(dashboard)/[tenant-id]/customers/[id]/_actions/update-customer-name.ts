"use server";

import { NotFoundError } from "@/errors/http/not-found.error";
import prisma from "@/lib/prisma";
import { Action, success, failure } from "@/core/action";
import { InternalServerError } from "@/errors";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/cache-tags";

type UpdateCustomerNameActionPayload = {
  customerId: string;
  tenantId: string;
  value: string;
};

export const updateCustomerNameAction: Action<
  UpdateCustomerNameActionPayload,
  void
> = async ({ value, customerId, tenantId }) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId, tenantId },
    });

    if (!customer) {
      return failure(new NotFoundError("customer not found"));
    }

    await prisma.customer.update({
      where: { id: customerId },
      data: { name: value },
    });

    revalidateTag(
      CACHE_TAGS.TENANT(tenantId).CUSTOMERS.CUSTOMER(customerId).INDEX
    );

    return success(undefined);
  } catch (error: unknown) {
    console.error("Failed to delete customer:", error);
    return failure(
      new InternalServerError("Ocorreu um erro durante o registro", {
        originalError: error instanceof Error ? error.message : String(error),
      })
    );
  }
};
