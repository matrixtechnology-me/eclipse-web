"use server";

import {
  createActionError,
  failure,
  ServerAction,
  success,
} from "@/core/server-actions";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type GetStocksActionPayload = {
  tenantId: string;
  page: number;
  pageSize: number;
  query: string;
};

type Stock = {
  id: string;
  totalQty: number;
  product: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
};

type GetStocksActionResult = {
  stocks: Stock[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
};

export const getStocksAction: ServerAction<
  GetStocksActionPayload,
  GetStocksActionResult
> = async ({ tenantId, page, pageSize, query }) => {
  try {
    const skip = (page - 1) * pageSize;

    const whereCondition: Prisma.StockWhereInput = {
      tenantId,
      product: {
        name: {
          contains: query,
          mode: "insensitive",
        },
        deletedAt: null,
      },
    };

    const [stocks, totalCount] = await Promise.all([
      prisma.stock.findMany({
        where: whereCondition,
        skip,
        take: pageSize,
        orderBy: {
          product: {
            name: "asc",
          },
        },
        select: {
          id: true,
          totalQty: true,
          product: {
            select: {
              id: true,
              name: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.stock.count({ where: whereCondition }),
    ]);

    const mappedStocks = stocks.map(
      (stock): Stock => ({
        product: {
          id: stock.product.id,
          name: stock.product.name,
        },
        id: stock.id,
        totalQty: stock.totalQty,
        createdAt: stock.createdAt,
        updatedAt: stock.updatedAt,
      })
    );

    return success({
      stocks: mappedStocks,
      pagination: {
        currentPage: page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error) {
    console.error(error);
    return failure(
      createActionError(
        500,
        "RegistrationError",
        "Ocorreu um erro durante o registro",
        {
          originalError: error instanceof Error ? error.message : String(error),
        }
      )
    );
  }
};
