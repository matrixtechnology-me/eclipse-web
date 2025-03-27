import prisma from "@/lib/prisma";

type GetCustomersActionPayload = {
  id: string;
};

type GetCustomersActionResult = {
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    created_at: Date;
    updated_at: Date;
  };
};

export const getCustomer = async ({ id }: GetCustomersActionPayload) => {
  const customer = await prisma.customer.findUnique({
    where: {
      id,
    },
  });
  return { data: { customer } };
};
