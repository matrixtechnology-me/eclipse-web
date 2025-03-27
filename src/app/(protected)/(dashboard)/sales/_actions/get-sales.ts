"use server";

import prisma from "@/lib/prisma";

type GetSalesActionPayload = {};

type GetSalesActionResult = {
  sales: {}[];
};

export const getSales = async () => {
  const sales = await prisma.sale.findMany();
  return { data: { sales } };
};
