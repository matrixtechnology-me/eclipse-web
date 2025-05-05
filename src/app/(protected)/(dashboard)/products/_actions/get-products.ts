"use server";

import { InternalServerError, NotFoundError } from "@/errors";
import prisma from "@/lib/prisma";
import { ServerAction, success, failure } from "@/core/server-actions";
import { Prisma } from "@prisma/client";
import { unstable_cacheTag as cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/config/cache-tags";

export type ProductListItem = {
  id: string;
  name: string;
  barCode: string;
  active: boolean;
  salePrice: number;
  createdAt: Date;
  updatedAt: Date;
};

type PaginatedProducts = {
  products: ProductListItem[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
};

type GetProductsActionPayload = {
  tenantId: string;
  page: number;
  pageSize: number;
  query: string;
};

export const getProductsAction: ServerAction<
  GetProductsActionPayload,
  PaginatedProducts
> = async ({ tenantId, page, pageSize, query }) => {
  try {
    const skip = (page - 1) * pageSize;

    const whereCondition: Prisma.ProductWhereInput = {
      tenantId,
      active: true,
      deletedAt: null,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { barCode: { contains: query, mode: "insensitive" } },
      ],
    };

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereCondition,
        skip,
        take: pageSize,
        orderBy: { name: "asc" },
      }),
      prisma.product.count({ where: whereCondition }),
    ]);

    if (!products.length) {
      return failure(new NotFoundError("No active products found"));
    }

    return success({
      products: products.map((product) => ({
        id: product.id,
        name: product.name,
        barCode: product.barCode,
        active: product.active,
        salePrice: product.salePrice.toNumber(),
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      })),
      pagination: {
        currentPage: page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error: unknown) {
    console.error("Failed to fetch products:", error);
    return failure(
      new InternalServerError("Ocorreu um erro durante o registro", {
        originalError: error instanceof Error ? error.message : String(error),
      })
    );
  }
};
