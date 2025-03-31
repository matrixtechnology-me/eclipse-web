"use server";

import { NotFoundError } from "@/errors/not-found";
import prisma from "@/lib/prisma";
import { ServerAction } from "@/types/server-actions";
import { propagateError } from "@/utils/propagate-error";
import { reportError } from "@/utils/report-error";
import { Prisma } from "@prisma/client";

export type Customer = {
  id: string;
  name: string;
  phoneNumber: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type GetCustomersActionPayload = {
  page: number;
  pageSize: number;
  query: string;
  tenantId: string;
};

type GetCustomersActionResult = {
  customers: Customer[];
};

export const getCustomers: ServerAction<
  GetCustomersActionPayload,
  GetCustomersActionResult
> = async ({ page, pageSize, tenantId, query }) => {
  try {
    const skip = (page - 1) * pageSize;

    const customers = await prisma.customer.findMany({
      where: {
        tenantId,
        name: {
          contains: query,
        },
      },
      skip,
      take: pageSize,
    });

    if (!customers?.length) throw new NotFoundError();

    return {
      data: {
        customers: customers.map((customer) => ({
          id: customer.id,
          name: customer.name,
          active: Boolean(customer.active),
          phoneNumber: customer.phoneNumber,
          createdAt: customer.createdAt,
          updatedAt: customer.updatedAt,
        })),
      },
    };
  } catch (error: any) {
    const expectedErrors = [NotFoundError.name];
    return expectedErrors.includes(error?.name)
      ? propagateError(error)
      : reportError(error);
  }
};
