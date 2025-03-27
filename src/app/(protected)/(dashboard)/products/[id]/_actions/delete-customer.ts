"use server";

import prisma from "@/lib/prisma";

type DeleteCustomerActionPayload = {
  id: string;
};

export const deleteCustomer = async ({ id }: DeleteCustomerActionPayload) => {
  await prisma.customer.delete({
    where: {
      id,
    },
  });
};
