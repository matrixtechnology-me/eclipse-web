"use server";

import { ApplicationError } from "@/errors/application";
import prisma from "@/lib/prisma";
import { ServerAction } from "@/types/server-actions";
import { propagateError } from "@/utils/propagate-error";

type GetSalesActionPayload = {
  tenantId: string;
  startDate?: Date;
  endDate?: Date;
  status?: "completed" | "pending" | "canceled";
};

type GetSalesActionResult = {
  sales: {
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
  }[];
};

export const getSales: ServerAction<
  GetSalesActionPayload,
  GetSalesActionResult
> = async ({ tenantId, startDate, endDate, status }) => {
  try {
    const sales = await prisma.sale.findMany({
      where: {
        tenantId,
        status,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      data: {
        sales: sales.map((sale) => ({
          costPrice: sale.products.reduce(
            (acc, product) => acc + product.costPrice,
            0
          ),
          salePrice: sale.products.reduce(
            (acc, product) => acc + product.salePrice,
            0
          ),
          createdAt: sale.createdAt,
          customer: sale.customer,
          id: sale.id,
          status: sale.status as "completed" | "pending" | "canceled",
          updatedAt: sale.updatedAt,
          totalItems: sale.products.reduce(
            (acc, product) => acc + product.totalQty,
            0
          ),
        })),
      },
    };
  } catch (error) {
    return propagateError(error as ApplicationError);
  }
};
