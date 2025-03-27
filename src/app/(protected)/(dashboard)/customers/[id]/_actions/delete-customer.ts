"use server";

import { NotFoundError } from "@/errors/not-found";
import prisma from "@/lib/prisma";
import { ServerAction } from "@/types/server-actions";
import { propagateError } from "@/utils/propagate-error";
import { reportError } from "@/utils/report-error";

type DeleteCustomerActionPayload = {
  id: string;
};

export const deleteCustomer: ServerAction<
  DeleteCustomerActionPayload,
  unknown
> = async ({ id }) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) throw new NotFoundError("customer not found");

    await prisma.customer.delete({
      where: {
        id,
      },
    });

    return { data: {} };
  } catch (error: any) {
    const expectedErrors = [NotFoundError.name];
    return expectedErrors.includes(error?.name)
      ? propagateError(error)
      : reportError(error);
  }
};
