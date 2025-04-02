"use server";

import prisma from "@/lib/prisma";
import { ServerAction, success, failure } from "@/core/server-actions";
import { reportError } from "@/utils/report-error.util";
import { BadRequestError } from "@/errors/http/bad-request.error";

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

export const getSales: ServerAction<
  {
    tenantId: string;
    startDate?: Date;
    endDate?: Date;
    status?: "completed" | "pending" | "canceled";
  },
  SaleItem[]
> = async ({ tenantId, startDate, endDate, status }) => {
  try {
    if (!tenantId) {
      throw new BadRequestError("Tenant ID is required");
    }

    const whereCondition = {
      tenantId,
      status,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    const sales = await prisma.sale.findMany({
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
      orderBy: { createdAt: "desc" },
    });

    const result = sales.map((sale) => ({
      id: sale.id,
      createdAt: sale.createdAt,
      updatedAt: sale.updatedAt,
      status: sale.status as "completed" | "pending" | "canceled",
      customer: sale.customer,
      costPrice: sale.products.reduce((acc, p) => acc + p.costPrice, 0),
      salePrice: sale.products.reduce((acc, p) => acc + p.salePrice, 0),
      totalItems: sale.products.reduce((acc, p) => acc + p.totalQty, 0),
    }));

    return success(result);
  } catch (error: unknown) {
    console.error("Failed to fetch sales:", error);
    if (error instanceof BadRequestError) return failure(error);
    return reportError(error);
  }
};
