"use server";

import prisma from "@/lib/prisma";
import { ServerAction, success, failure } from "@/core/server-actions";
import { BadRequestError } from "@/errors/http/bad-request.error";
import { InternalServerError } from "@/errors";
import { Prisma } from "@prisma/client";

export type SaleItem = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  costPrice: number;
  salePrice: number;
  totalItems: number;
  status: "completed" | "pending" | "canceled";
  customer: {
    id: string;
    name: string;
    phoneNumber: string;
  };
};

type GetSalesActionPayload = {
  tenantId: string;
  page: number;
  pageSize: number;
  query?: string;
  startDate?: Date;
  endDate?: Date;
  status?: "completed" | "pending" | "canceled";
};

type GetSalesActionResult = {
  sales: SaleItem[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
};

export const getSalesAction: ServerAction<
  GetSalesActionPayload,
  GetSalesActionResult
> = async ({ tenantId, page, pageSize, query, startDate, endDate, status }) => {
  try {
    if (!tenantId) {
      throw new BadRequestError("Tenant ID is required");
    }

    const skip = (page - 1) * pageSize;

    const whereCondition: Prisma.SaleWhereInput = {
      tenantId,
      status,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      customer: {
        OR: query
          ? [
              {
                name: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                phoneNumber: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            ]
          : undefined,
      },
    };

    const [sales, totalCount] = await Promise.all([
      prisma.sale.findMany({
        where: whereCondition,
        include: {
          products: true,
          customer: {
            select: {
              id: true,
              name: true,
              phoneNumber: true,
            },
          },
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.sale.count({
        where: whereCondition,
      }),
    ]);

    const mappedSales: SaleItem[] = sales.map((sale) => ({
      id: sale.id,
      createdAt: sale.createdAt,
      updatedAt: sale.updatedAt,
      status: sale.status as "completed" | "pending" | "canceled",
      customer: sale.customer,
      costPrice: sale.products.reduce(
        (acc, p) => acc + p.costPrice.toNumber(),
        0
      ),
      salePrice: sale.products.reduce(
        (acc, p) => acc + p.salePrice.toNumber(),
        0
      ),
      totalItems: sale.products.reduce((acc, p) => acc + p.totalQty, 0),
    }));

    return success({
      sales: mappedSales,
      pagination: {
        currentPage: page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error: unknown) {
    console.error("Failed to fetch sales:", error);
    return failure(
      new InternalServerError("Erro ao buscar vendas", {
        originalError: error instanceof Error ? error.message : String(error),
      })
    );
  }
};
