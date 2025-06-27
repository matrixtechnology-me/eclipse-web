"use server";

import { Action, success, failure } from "@/lib/action";
import { BadRequestError } from "@/errors/http/bad-request.error";
import { InternalServerError } from "@/errors";
import {
  EPaymentStatus,
  ESaleStatus,
  Prisma,
  PrismaClient,
} from "@prisma/client";
import { unstable_cacheTag as cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/config/cache-tags";

const extendedPrisma = new PrismaClient().$extends({
  result: {
    sale: {
      paymentStatus: {
        needs: { paidTotal: true, estimatedTotal: true },
        compute({ paidTotal, estimatedTotal }) {
          return paidTotal < estimatedTotal
            ? EPaymentStatus.Pending
            : EPaymentStatus.Paid;
        },
      },
    },
  },
});

export type SaleItem = {
  id: string;
  totalItems: number;
  paidTotal: number;
  estimatedTotal: number;
  products: Array<{
    id: string;
    name: string;
    salePrice: number;
    totalQty: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
};

type GetCustomerPendingSalesActionPayload = {
  page: number;
  pageSize: number;
  customerId: string;
  tenantId: string;
};

type GetCustomerPendingSalesActionResult = {
  sales: SaleItem[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
};

export const getCustomerPendingSalesAction: Action<
  GetCustomerPendingSalesActionPayload,
  GetCustomerPendingSalesActionResult
> = async ({ customerId, tenantId, page, pageSize }) => {
  "use cache";
  cacheTag(CACHE_TAGS.TENANT(tenantId).SALES.INDEX.ALL);

  try {
    if (!tenantId) throw new BadRequestError("Tenant ID is required");

    if (!customerId) throw new BadRequestError("Customer ID is required");

    const skip = (page - 1) * pageSize;

    const whereCondition: Prisma.SaleWhereInput = {
      tenantId,
      status: ESaleStatus.Processed, // Reanalyse when more enums.
      deletedAt: null,
      customer: {
        id: customerId,
      },
    };

    const [sales, totalCount] = await Promise.all([
      extendedPrisma.sale.findMany({
        where: whereCondition,
        include: {
          products: true,
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      extendedPrisma.sale.count({
        where: whereCondition,
      }),
    ]);

    const paymentPendingSales = sales.filter(
      s => s.paymentStatus == EPaymentStatus.Pending
    );

    const mappedSales: SaleItem[] = paymentPendingSales.map((sale) => ({
      id: sale.id,
      paidTotal: sale.paidTotal.toNumber(),
      estimatedTotal: sale.estimatedTotal.toNumber(),
      products: sale.products.map(p => ({
        id: p.id,
        name: p.name,
        salePrice: p.salePrice.toNumber(),
        totalQty: p.totalQty,
      })),
      totalItems: sale.products.reduce((acc, p) => acc + p.totalQty, 0),
      createdAt: sale.createdAt,
      updatedAt: sale.updatedAt,
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
    console.error("Failed to fetch customer sales:", error);
    return failure(
      new InternalServerError("Erro ao buscar vendas do cliente", {
        originalError: error instanceof Error ? error.message : String(error),
      })
    );
  }
};
