"use server";

import prisma from "@/lib/prisma";
import { ServerAction } from "@/types/server-actions";
import { propagateError } from "@/utils/propagate-error";

type CreateCustomerActionPayload = {
  name: string;
  phoneNumber: string;
  tenantId: string;
};

type CreateCustomerActionResult = {};

export const createCustomer: ServerAction<
  CreateCustomerActionPayload,
  CreateCustomerActionResult
> = async ({ name, phoneNumber, tenantId }) => {
  try {
    await prisma.customer.create({
      data: {
        name,
        phoneNumber,
        tenantId,
      },
    });

    return { data: {} };
  } catch (error) {
    return propagateError(error as Error);
  }
};
