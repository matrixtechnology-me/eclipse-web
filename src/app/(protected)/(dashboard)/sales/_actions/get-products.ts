"use server";

import prisma from "@/lib/prisma";
import { EStockStrategy, Prisma } from "@prisma/client";
import { failure, ServerAction, success } from "@/core/server-actions";
import { reportError } from "@/utils/report-error.util";
import { InternalServerError } from "@/errors";

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

export type ProductsWithPagination = {
  results: Product[];
  pagination: {
    limit: number;
    currentPage: number;
    totalItems: number;
    totalPages: number;
  };
};

export const getProducts: ServerAction<
  GetProductsActionPayload,
  ProductsWithPagination
> = async ({ searchValue, page, limit, active }) => {
  try {
    const skip = (page - 1) * limit;

    const whereCondition: Prisma.ProductWhereInput = {
      AND: [
        searchValue
          ? {
              OR: [
                { name: { contains: searchValue, mode: "insensitive" } },
                { description: { contains: searchValue, mode: "insensitive" } },
                { skuCode: { contains: searchValue, mode: "insensitive" } },
              ],
            }
          : {},
        { active },
      ],
    };

    const [rawProducts, totalItems] = await Promise.all([
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
                orderBy: {
                  expiresAt: "asc",
                },
              },
            },
          },
        },
        orderBy: { name: "asc" },
      }),
      prisma.product.count({ where: whereCondition }),
    ]);

    const results = rawProducts.map((product) => {
      const strategy = product.stock?.strategy;
      const lots = product.stock?.lots || [];

      const sortedLots =
        strategy === EStockStrategy.Lifo ? [...lots].reverse() : lots;

      return {
        id: product.id,
        name: product.name,
        costPrice: sortedLots[0]?.costPrice ?? 0,
        salePrice: product.salePrice,
      };
    });

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
    console.error("Failed to fetch products:", error);
    return failure(new InternalServerError());
  }
};
