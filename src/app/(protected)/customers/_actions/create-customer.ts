"use server";

import prisma from "@/lib/prisma";

export const createCustomer = async (formData: FormData) => {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const address = formData.get("address") as string;

  await prisma.customer.create({
    data: { firstName: name, lastName: name, phoneNumber: "", status: "" },
  });
};
