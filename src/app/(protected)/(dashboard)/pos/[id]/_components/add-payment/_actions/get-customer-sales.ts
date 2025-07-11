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
  cacheTag(CACHE_TAGS.TENANT(tenantId).SALES.INDEX.ALL);

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
          products: {
            select: {
              salePrice: true,
              totalQty: true,
              stockLotUsages: {
                include: {
                  stockLot: {
                    select: { costPrice: true }
                  }
                },
              },
            },
          }
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.sale.count({
        where: whereCondition,
      }),
    ]);

    // TODO: handle numeric operations with precision.
    const mappedCustomerSales: SaleItem[] = sales.map((sale) => {
      const saleCostPrice = sale.products.reduce((saleAcc, product) => {
        const prodUnitsCost = product.stockLotUsages.reduce(
          (prodAcc, { quantity, stockLot }) => {
            return prodAcc + stockLot.costPrice.toNumber() * quantity
          }, 0);

        return saleAcc + prodUnitsCost;
      }, 0);

      return {
        id: sale.id,
        createdAt: sale.createdAt,
        updatedAt: sale.updatedAt,
        status: sale.status,
        paidTotal: sale.paidTotal.toNumber(),
        costPrice: saleCostPrice,
        salePrice: sale.products.reduce(
          (acc, p) => acc + (p.salePrice.toNumber() * p.totalQty),
          0
        ),
        totalItems: sale.products.reduce((acc, p) => acc + p.totalQty, 0),
      };
    });

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
