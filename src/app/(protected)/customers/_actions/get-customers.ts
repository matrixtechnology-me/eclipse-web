import prisma from "@/lib/prisma";

type GetCustomersActionPayload = {};

type GetCustomersActionResult = {
  customers: {}[];
};

export const getCustomers = async () => {
  const customers = await prisma.customer.findMany();
  return { data: { customers } };
};
