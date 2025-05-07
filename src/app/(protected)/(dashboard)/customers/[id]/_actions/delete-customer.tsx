"use server";

import { failure, ServerAction, success } from "@/core/server-actions";
import { InternalServerError, NotFoundError } from "@/errors";
import prisma from "@/lib/prisma";

type DeleteCustomerActionPayload = {
  customerId: string;
  tenantId: string;
};

export const deleteCustomerAction: ServerAction<
  DeleteCustomerActionPayload
> = async ({ customerId, tenantId }) => {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: {
        id: tenantId,
      },
    });

    if (!tenant) return failure(new NotFoundError("tenant not found"));

    const customer = await prisma.customer.findUnique({
      where: {
        id: customerId,
        tenantId,
      },
    });

    if (!customer) return failure(new NotFoundError("customer not found"));

    await prisma.customer.update({
      where: { id: customerId },
      data: {
        name: "Anônimo",
        phoneNumber: null,
        active: false,
        deletedAt: new Date(),
      },
    });

    return success({});
  } catch (error) {
    console.error(error);
    return failure(
      new InternalServerError(
        `cannot delete customer with id ${customerId} because error: ${error}`
      )
    );
  }
};
