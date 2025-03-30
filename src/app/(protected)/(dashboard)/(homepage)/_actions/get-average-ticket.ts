import prisma from "@/lib/prisma";
import { ServerAction } from "@/types/server-actions";
import { reportError } from "@/utils/report-error";

export type GetAverageTicketActionPayload = {
  tenantId: string;
};

export type GetAverageTicketActionResult = {
  averageTicket: number;
};

export const getAverageTicket: ServerAction<
  GetAverageTicketActionPayload,
  GetAverageTicketActionResult
> = async ({ tenantId }) => {
  try {
    const sales = await prisma.sale.findMany({
      where: {
        tenantId,
      },
      select: {
        products: true,
      },
    });

    const total = sales.reduce((accumulator, sale) => {
      const saleTotal = sale.products.reduce((productAccumulator, product) => {
        return productAccumulator + product.salePrice;
      }, 0);
      return accumulator + saleTotal;
    }, 0);

    const averageTicket = sales.length > 0 ? total / sales.length : 0;

    return { data: { averageTicket } };
  } catch (error) {
    return reportError(error as Error);
  }
};
