"use server";

import prisma from "@/lib/prisma";
import { Prisma, Customer } from "@prisma/client";

type GetCustomersActionPayload = {
  searchValue: string;
  page: number;
  limit: number;
  active: boolean;
};

export type GetCustomersActionResult = {
  data: {
    results: Customer[];
    pagination: Pagination;
  };
};

export type Pagination = {
  limit: number;
  currentPage: number;
  totalItems: number;
  totalPages: number;
};

export const getCustomers = async ({
  searchValue,
  page,
  limit,
  active,
}: GetCustomersActionPayload): Promise<GetCustomersActionResult> => {
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

  return {
    data: {
      results,
      pagination: {
        limit,
        currentPage: page,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    },
  };
};
