import { NotFoundError } from "@/errors/not-found";
import prisma from "@/lib/prisma";
import { ServerAction } from "@/types/server-actions";
import { propagateError } from "@/utils/propagate-error";
import { reportError } from "@/utils/report-error";

export type Customer = {
  id: string;
  name: string;
  phoneNumber: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type GetCustomersActionPayload = {
  id: string;
};

type GetCustomersActionResult = {
  customer: Customer;
};

export const getCustomer: ServerAction<
  GetCustomersActionPayload,
  GetCustomersActionResult
> = async ({ id }) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: {
        id,
      },
    });

    if (!customer) throw new NotFoundError("customer not found");

    return {
      data: { customer: { ...customer, active: Boolean(customer.active) } },
    };
  } catch (error: any) {
    const expectedErrors = [NotFoundError.name];
    return expectedErrors.includes(error.name)
      ? propagateError(error)
      : reportError(error);
  }
};
