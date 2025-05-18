"use server";

import { InternalServerError } from "@/errors";
import { Action, failure, success } from "@/lib/action";
import prisma from "@/lib/prisma";
import { ESaleStatus } from "@prisma/client";

type GetCustomersActionPayload = {
  tenantId: string;
};

export type Customer = {
  id: string;
  name: string;
  avatarUrl: string;
  totalSpent: number;
};

type GetCustomersActionResult = {
  customers: Customer[];
};

export const getCustomersAction: Action<
  GetCustomersActionPayload,
  GetCustomersActionResult
> = async ({ tenantId }) => {
  try {
    const customers = await prisma.sale.groupBy({
      by: ["customerId"],
      where: {
        tenantId,
        status: ESaleStatus.Processed,
      },
      _sum: {
        paidTotal: true,
      },
      orderBy: {
        _sum: {
          paidTotal: "desc",
        },
      },
      take: 10,
    });

    const customerIds = customers.map((c) => c.customerId as string);

    const customerData = await prisma.customer.findMany({
      where: {
        id: { in: customerIds },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const mappedCustomers: Customer[] = customers.map((c) => {
      const customer = customerData.find((cd) => cd.id === c.customerId);
      return {
        id: customer?.id || c.customerId!,
        name: customer?.name || "Desconhecido",
        totalSpent: Number(c._sum.paidTotal),
        avatarUrl: "",
      };
    });

    return success({ customers: mappedCustomers });
  } catch (error) {
    console.error(error);
    return failure(new InternalServerError("cannot get top customers"));
  }
};
