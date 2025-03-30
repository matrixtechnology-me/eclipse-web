import prisma from "@/lib/prisma";
import { ServerAction } from "@/types/server-actions";
import { reportError } from "@/utils/report-error";

export type GetInvoicingActionPayload = {
  tenantId: string;
};

export type GetInvoicingActionResult = {
  invoicing: number;
};

export const getInvoicing: ServerAction<
  GetInvoicingActionPayload,
  GetInvoicingActionResult
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

    const invoicing = sales.reduce((accumulator, sale) => {
      const saleTotal = sale.products.reduce((productAccumulator, product) => {
        return productAccumulator + product.salePrice;
      }, 0);
      return accumulator + saleTotal;
    }, 0);

    return { data: { invoicing } };
  } catch (error) {
    return reportError(error as Error);
  }
};
