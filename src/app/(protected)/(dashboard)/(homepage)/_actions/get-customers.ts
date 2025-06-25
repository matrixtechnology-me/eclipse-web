"use server";

import { CACHE_TAGS } from "@/config/cache-tags";
import { InternalServerError } from "@/errors";
import { Action, failure, success } from "@/lib/action";
import prisma from "@/lib/prisma";
import { ESaleStatus } from "@prisma/client";
import { unstable_cacheTag as cacheTag } from "next/cache";

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

const page = 1;
const pageSize = 10;

export const getCustomersAction: Action<
  GetCustomersActionPayload,
  GetCustomersActionResult
> = async ({ tenantId }) => {
  "use cache";
  cacheTag(
    CACHE_TAGS.TENANT(tenantId).CUSTOMERS.INDEX.ALL,
    CACHE_TAGS.TENANT(tenantId).CUSTOMERS.INDEX.PAGINATED(page, pageSize),
  );

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
      skip: (page - 1) * pageSize,
      take: pageSize,
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
