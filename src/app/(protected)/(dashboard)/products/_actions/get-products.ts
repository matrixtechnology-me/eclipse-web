"use server";

import prisma from "@/lib/prisma";

type GetCustomersActionPayload = {};

type GetCustomersActionResult = {
  customers: {}[];
};

export const getProducts = async () => {
  const products = await prisma.product.findMany();
  return { data: { products } };
};
