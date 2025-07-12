"use server";

import prisma from "@/lib/prisma";
import { EStockStrategy, Prisma } from "@prisma/client";
import { failure, Action, success } from "@/lib/action";
import { InternalServerError } from "@/errors";

type GetProductsActionPayload = {
  searchValue: string;
  page: number;
  limit: number;
  active: boolean;
  tenantId: string;
};

export type Product = {
  id: string;
  name: string;
  costPrice: number;
  salePrice: number;
  availableQty: number;
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

export const getProducts: Action<
  GetProductsActionPayload,
  ProductsWithPagination
> = async ({ searchValue, page, limit, active, tenantId }) => {
  try {
    const skip = (page - 1) * limit;

    const whereCondition: Prisma.ProductWhereInput = {
      tenantId,
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
        {
          active,
          stock: {
            lots: {
              some: {
                totalQty: { gt: 0 },
              },
            },
          },
        },
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
                  totalQty: true,
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

      const totalAvailable = lots.reduce((sum, lot) => sum + lot.totalQty, 0);

      return {
        id: product.id,
        name: product.name,
        costPrice: sortedLots[0]?.costPrice.toNumber() ?? 0,
        salePrice: product.salePrice.toNumber(),
        availableQty: totalAvailable,
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
