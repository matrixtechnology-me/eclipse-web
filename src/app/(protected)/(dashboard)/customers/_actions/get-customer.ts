"use server";

import { NotFoundError } from "@/errors/http/not-found.error";
import prisma from "@/lib/prisma";
import { ServerAction, success, failure } from "@/core/server-actions";
import { reportError } from "@/utils/report-error.util";
import { InternalServerError } from "@/errors";

export type Customer = {
  id: string;
  name: string;
  phoneNumber: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type GetCustomerActionPayload = {
  id: string;
};

export const getCustomer: ServerAction<
  GetCustomerActionPayload,
  { customer: Customer }
> = async ({ id }) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundError("Customer not found");
    }

    return success({
      customer: {
        ...customer,
        active: Boolean(customer.active),
      },
    });
  } catch (error: unknown) {
    console.error(`Failed to fetch customer ${id}:`, error);
    return failure(
      new InternalServerError("Ocorreu um erro durante o registro", {
        originalError: error instanceof Error ? error.message : String(error),
      })
    );
  }
};
