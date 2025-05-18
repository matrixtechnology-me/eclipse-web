"use server";

import { InternalServerError } from "@/errors";
import { Action, failure, success } from "@/lib/action";
import prisma from "@/lib/prisma";
import { ESaleStatus, Prisma } from "@prisma/client";

type GetSalesActionPayload = {
  tenantId: string;
};

export type Sale = {
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
  };
};

type GetSalesActionResult = {
  sales: Sale[];
};

export const getSalesAction: Action<
  GetSalesActionPayload,
  GetSalesActionResult
> = async ({ tenantId }) => {
  try {
    const whereCondition: Prisma.SaleWhereInput = {
      tenantId,
      status: ESaleStatus.Processed,
      deletedAt: null,
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

    const mappedSales: Sale[] = sales.map((sale) => ({
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
    });
  } catch (error) {
    console.error(error);
    return failure(new InternalServerError("cannot get top customers"));
  }
};
