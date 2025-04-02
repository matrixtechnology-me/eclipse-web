"use server";

import prisma from "@/lib/prisma";
import { Prisma, Customer } from "@prisma/client";
import { ServerAction, success } from "@/core/server-actions";
import { reportError } from "@/utils/report-error.util";

type GetCustomersActionPayload = {
  searchValue: string;
  page: number;
  limit: number;
  active: boolean;
};

type CustomerWithPagination = {
  results: Customer[];
  pagination: {
    limit: number;
    currentPage: number;
    totalItems: number;
    totalPages: number;
  };
};

export const getCustomers: ServerAction<
  GetCustomersActionPayload,
  CustomerWithPagination
> = async ({ searchValue, page, limit, active }) => {
  try {
    const skip = (page - 1) * limit;

    const whereCondition: Prisma.CustomerWhereInput = {
      AND: [
        searchValue
          ? {
              OR: [{ name: { contains: searchValue, mode: "insensitive" } }],
            }
          : {},
        { active },
      ],
    };

    const [results, totalItems] = await Promise.all([
      prisma.customer.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: { name: "asc" },
      }),
      prisma.customer.count({ where: whereCondition }),
    ]);

    return success({
      results,
      pagination: {
        limit,
        currentPage: page,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    });
  } catch (error: unknown) {
    console.error("Failed to fetch customers:", error);
    return reportError(error);
  }
};
