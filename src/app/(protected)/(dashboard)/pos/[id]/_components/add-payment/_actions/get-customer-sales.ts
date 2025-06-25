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
  paidTotal: number;
  status: ESaleStatus;
};

type GetCustomerSalesActionPayload = {
  page: number;
  pageSize: number;
  customerId: string;
  tenantId: string;
  status?: ESaleStatus;
};

type GetCustomerSalesActionResult = {
  sales: SaleItem[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
};

export const getCustomerSalesAction: Action<
  GetCustomerSalesActionPayload,
  GetCustomerSalesActionResult
> = async ({ customerId, tenantId, status, page, pageSize }) => {
  "use cache";
  cacheTag(
    CACHE_TAGS.TENANT(tenantId).SALES.FROM_CUSTOMER(customerId).ALL,
    CACHE_TAGS.TENANT(tenantId).SALES.FROM_CUSTOMER(customerId).PAGINATED(page, pageSize)
  );

  try {
    if (!tenantId) throw new BadRequestError("Tenant ID is required");

    if (!customerId) throw new BadRequestError("Customer ID is required");

    const skip = (page - 1) * pageSize;

    const whereCondition: Prisma.SaleWhereInput = {
      tenantId,
      status,
      deletedAt: null,
      customer: {
        id: customerId,
      },
    };

    const [sales, totalCount] = await Promise.all([
      prisma.sale.findMany({
        where: whereCondition,
        include: {
          products: true,
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.sale.count({
        where: whereCondition,
      }),
    ]);

    const mappedCustomerSales: SaleItem[] = sales.map((sale) => ({
      id: sale.id,
      createdAt: sale.createdAt,
      updatedAt: sale.updatedAt,
      status: sale.status,
      paidTotal: sale.paidTotal.toNumber(),
      costPrice: sale.products.reduce(
        (acc, p) => acc + (p.costPrice.toNumber() * p.totalQty),
        0
      ),
      salePrice: sale.products.reduce(
        (acc, p) => acc + (p.salePrice.toNumber() * p.totalQty),
        0
      ),
      totalItems: sale.products.reduce((acc, p) => acc + p.totalQty, 0),
    }));

    return success({
      sales: mappedCustomerSales,
      pagination: {
        currentPage: page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error: unknown) {
    console.error("Failed to fetch customer sales:", error);
    return failure(
      new InternalServerError("Erro ao buscar vendas do cliente", {
        originalError: error instanceof Error ? error.message : String(error),
      })
    );
  }
};
