"use server";

import prisma from "@/lib/prisma";
import { EStockStrategy, Prisma } from "@prisma/client";

type GetProductsActionPayload = {
  searchValue: string;
  page: number;
  limit: number;
  active: boolean;
};

export type Product = {
  id: string;
  name: string;
  costPrice: number;
  salePrice: number;
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
      include: {
        stock: {
          select: {
            strategy: true,
            lots: {
              select: {
                costPrice: true,
                expiresAt: true,
              },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.product.count({ where: whereCondition }),
  ]);

  return {
    data: {
      results: results.map((result) => {
        const orderDirection =
          result.stock?.strategy === EStockStrategy.Fifo ? "asc" : "desc";

        const ordenedLots = result.stock?.lots.sort((a, b) => {
          if (a.expiresAt === null && b.expiresAt === null) return 0;
          if (a.expiresAt === null) return 1;
          if (b.expiresAt === null) return -1;

          return orderDirection === "asc"
            ? new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime()
            : new Date(b.expiresAt).getTime() - new Date(a.expiresAt).getTime();
        });

        return {
          costPrice: ordenedLots?.[0]?.costPrice.toNumber() ?? 0,
          id: result.id,
          name: result.name,
          salePrice: result.salePrice.toNumber(),
        };
      }),
      pagination: {
        limit,
        currentPage: page,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    },
  };
};
