"use server";

import { NotFoundError } from "@/errors/http/not-found.error";
import prisma from "@/lib/prisma";
import { Action, success, failure } from "@/core/action";
import { Prisma } from "@prisma/client";
import { InternalServerError } from "@/errors";

export type Customer = {
  id: string;
  name: string;
  phoneNumber: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type PaginatedCustomers = {
  customers: Customer[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
};

type GetCustomersActionPayload = {
  page: number;
  pageSize: number;
  query: string;
  tenantId: string;
};

export const getCustomers: Action<
  GetCustomersActionPayload,
  PaginatedCustomers
> = async ({ page, pageSize, tenantId, query }) => {
  try {
    const skip = (page - 1) * pageSize;

    const whereCondition: Prisma.CustomerWhereInput = {
      tenantId,
      deletedAt: null,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { phoneNumber: { contains: query, mode: "insensitive" } },
      ],
    };

    const [customers, totalCount] = await Promise.all([
      prisma.customer.findMany({
        where: whereCondition,
        skip,
        take: pageSize,
        orderBy: { name: "asc" },
      }),
      prisma.customer.count({ where: whereCondition }),
    ]);

    if (!customers.length) {
      return failure(new NotFoundError("No customers found"));
    }

    return success({
      customers: customers.map((customer) => ({
        ...customer,
        phoneNumber: customer.phoneNumber!,
        active: Boolean(customer.active),
      })),
      pagination: {
        currentPage: page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error: unknown) {
    console.error("Failed to fetch customers:", error);
    return failure(
      new InternalServerError("Ocorreu um erro durante o registro", {
        originalError: error instanceof Error ? error.message : String(error),
      })
    );
  }
};
