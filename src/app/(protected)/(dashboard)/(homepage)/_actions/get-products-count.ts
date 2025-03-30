import prisma from "@/lib/prisma";
import { ServerAction } from "@/types/server-actions";
import { reportError } from "@/utils/report-error";

export type GetProductsCountActionPayload = {
  tenantId: string;
};

export type GetProductsCountActionResult = {
  count: number;
};

export const getProductsCount: ServerAction<
  GetProductsCountActionPayload,
  GetProductsCountActionResult
> = async ({ tenantId }) => {
  try {
    const productsCount = await prisma.product.count({
      where: {
        tenantId,
      },
    });

    return { data: { count: productsCount } };
  } catch (error) {
    return reportError(error as Error);
  }
};
