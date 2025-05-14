"use server";

import prisma from "@/lib/prisma";
import { Action, success, failure } from "@/core/action";
import { BadRequestError } from "@/errors/http/bad-request.error";
import { InternalServerError } from "@/errors";
import moment from "moment";
import { ESaleStatus } from "@prisma/client";

type GetRetrospectiveActionPayload = { tenantId: string };

export type MonthlyFinancialData = {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
};

export type GetRetrospectiveActionResult = {
  retrospective: MonthlyFinancialData[];
  growthPercentage: number;
};

export const getRetrospectiveAction: Action<
  GetRetrospectiveActionPayload,
  GetRetrospectiveActionResult
> = async ({ tenantId }) => {
  try {
    if (!tenantId) {
      throw new BadRequestError("Tenant ID is required");
    }

    const endDate = moment().endOf("month").toDate();
    const startDate = moment().subtract(11, "months").startOf("month").toDate();

    const sales = await prisma.sale.findMany({
      where: {
        tenantId,
        status: ESaleStatus.Processed,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        deletedAt: null,
      },
      include: {
        products: {
          select: {
            salePrice: true,
            costPrice: true,
            totalQty: true,
            createdAt: true,
          },
        },
      },
    });

    const monthlyData: Record<string, { revenue: number; cost: number }> = {};

    for (let i = 0; i < 12; i++) {
      const monthKey = moment()
        .subtract(11 - i, "months")
        .format("YYYY-MM");
      monthlyData[monthKey] = { revenue: 0, cost: 0 };
    }

    sales.forEach((sale) => {
      sale.products.forEach((product) => {
        const monthKey = moment(product.createdAt).format("YYYY-MM");
        if (monthlyData[monthKey]) {
          monthlyData[monthKey].revenue +=
            product.salePrice.toNumber() * product.totalQty;
          monthlyData[monthKey].cost +=
            product.costPrice.toNumber() * product.totalQty;
        }
      });
    });

    const retrospective = Object.entries(monthlyData).map(
      ([month, { revenue, cost }]) => ({
        month,
        revenue,
        cost,
        profit: revenue - cost,
      })
    );

    const currentMonth = moment().format("YYYY-MM");
    const previousMonth = moment().subtract(1, "month").format("YYYY-MM");

    const currentMonthData = retrospective.find(
      (item) => item.month === currentMonth
    );
    const previousMonthData = retrospective.find(
      (item) => item.month === previousMonth
    );

    let growthPercentage = 0;
    if (
      currentMonthData &&
      previousMonthData &&
      previousMonthData.revenue > 0
    ) {
      growthPercentage =
        ((currentMonthData.revenue - previousMonthData.revenue) /
          previousMonthData.revenue) *
        100;
    }

    return success({
      retrospective,
      growthPercentage,
    });
  } catch (error: unknown) {
    console.error(error);
    return failure(
      new InternalServerError(
        `failed to get retrospective data for tenant ${tenantId}`
      )
    );
  }
};
