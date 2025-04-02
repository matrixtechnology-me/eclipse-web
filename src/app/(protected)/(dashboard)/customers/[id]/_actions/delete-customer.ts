"use server";

import { NotFoundError } from "@/errors/http/not-found.error";
import prisma from "@/lib/prisma";
import { ServerAction, success, failure } from "@/core/server-actions";
import { reportError } from "@/utils/report-error.util";

type DeleteCustomerActionPayload = {
  id: string;
};

export const deleteCustomer: ServerAction<
  DeleteCustomerActionPayload,
  void
> = async ({ id }) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      return failure(new NotFoundError("Customer not found"));
    }

    await prisma.customer.delete({
      where: { id },
    });

    return success(undefined);
  } catch (error: unknown) {
    console.error("Failed to delete customer:", error);
    return reportError(error);
  }
};
