import prisma from "@/lib/prisma";
import { ServerAction } from "@/types/server-actions";
import { reportError } from "@/utils/report-error";

export type GetCustomersCountActionPayload = {
  tenantId: string;
};

export type GetCustomersCountActionResult = {
  count: number;
};

export const getCustomersCount: ServerAction<
  GetCustomersCountActionPayload,
  GetCustomersCountActionResult
> = async ({ tenantId }) => {
  try {
    const customersCount = await prisma.customer.count({
      where: {
        tenantId,
      },
    });

    return { data: { count: customersCount } };
  } catch (error) {
    return reportError(error as Error);
  }
};
