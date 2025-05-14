"use server";

import prisma from "@/lib/prisma";
import { Action, success, failure } from "@/lib/action";
import { BadRequestError } from "@/errors/http/bad-request.error";
import { InternalServerError } from "@/errors";
import { ESaleStatus, Prisma } from "@prisma/client";
import { unstable_cacheTag as cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/config/cache-tags";

export type SaleItem = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  costPrice: number;
  salePrice: number;
  totalItems: number;
  status: ESaleStatus;
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
  status?: ESaleStatus;
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

export const getSalesAction: Action<
  GetSalesActionPayload,
  GetSalesActionResult
> = async ({ tenantId, page, pageSize, query, startDate, endDate, status }) => {
  "use cache";
  cacheTag(
    CACHE_TAGS.TENANT(tenantId).SALES.INDEX.GENERAL,
    CACHE_TAGS.TENANT(tenantId).SALES.INDEX.PAGINATED(page, pageSize)
  );

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
      status: sale.status,
      customer: {
        ...sale.customer,
        phoneNumber: sale.customer.phoneNumber ?? "00000000000",
      },
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
