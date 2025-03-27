"use server";

import prisma from "@/lib/prisma";
import { Prisma, Product } from "@prisma/client";

type GetProductsActionPayload = {
  searchValue: string;
  page: number;
  limit: number;
  active: boolean;
};

export type GetProductsActionResult = {
  data: {
    results: Product[];
    pagination: Pagination;
  };
};

export type Pagination = {
  limit: number;
  currentPage: number;
  totalItems: number;
  totalPages: number;
};

export const getProducts = async ({
  searchValue,
  page,
  limit,
  active,
}: GetProductsActionPayload): Promise<GetProductsActionResult> => {
  const skip = (page - 1) * limit;

  const whereCondition: Prisma.ProductWhereInput = {
    AND: [
      searchValue
        ? {
            OR: [
              { name: { contains: searchValue, mode: "insensitive" } },
              { description: { contains: searchValue, mode: "insensitive" } },
            ],
          }
        : {},
      { active },
    ],
  };

  const [results, totalItems] = await Promise.all([
    prisma.product.findMany({
      where: whereCondition,
      skip,
      take: limit,
      orderBy: { name: "asc" },
    }),
    prisma.product.count({ where: whereCondition }),
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
