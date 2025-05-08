"use server";

import { NotFoundError } from "@/errors/http/not-found.error";
import prisma from "@/lib/prisma";
import { ServerAction, success, failure } from "@/core/server-actions";
import { InternalServerError } from "@/errors";
import { unstable_cacheTag as cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/config/cache-tags";

export type Customer = {
  id: string;
  name: string;
  phoneNumber: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type GetCustomerActionPayload = {
  customerId: string;
  tenantId: string;
};

export const getCustomer: ServerAction<
  GetCustomerActionPayload,
  { customer: Customer }
> = async ({ customerId, tenantId }) => {
  "use cache";
  cacheTag(CACHE_TAGS.TENANT(tenantId).CUSTOMERS.CUSTOMER(customerId).INDEX);

  try {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId, tenantId, deletedAt: null },
    });

    if (!customer) {
      throw new NotFoundError("Customer not found");
    }

    return success({
      customer: {
        ...customer,
        active: Boolean(customer.active),
        phoneNumber: customer.phoneNumber!,
      },
    });
  } catch (error: unknown) {
    console.error(`Failed to fetch customer ${customerId}:`, error);
    return failure(
      new InternalServerError("Ocorreu um erro durante o registro", {
        originalError: error instanceof Error ? error.message : String(error),
      })
    );
  }
};
