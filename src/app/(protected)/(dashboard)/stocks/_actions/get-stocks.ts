import {
  createActionError,
  failure,
  ServerAction,
  success,
} from "@/core/server-actions";
import prisma from "@/lib/prisma";

type GetStocksActionPayload = {
  tenantId: string;
};

type Stock = {
  id: string;
  totalQty: number;
  product: {
    id: string;
    name: string;
  };
};

type GetStocksActionResult = {
  stocks: Stock[];
};

export const getStocksAction: ServerAction<
  GetStocksActionPayload,
  GetStocksActionResult
> = async ({ tenantId }) => {
  try {
    const stocks = await prisma.stock.findMany({
      where: {
        tenantId,
      },
      select: {
        id: true,
        totalQty: true,
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const mappedStocks = stocks.map(
      (stock): Stock => ({
        product: {
          id: stock.product.id,
          name: stock.product.name,
        },
        id: stock.id,
        totalQty: stock.totalQty,
      })
    );

    return success({ stocks: mappedStocks });
  } catch (error) {
    console.error(error);
    return failure(
      createActionError(
        500,
        "RegistrationError",
        "Ocorreu um erro durante o registro",
        {
          originalError: error instanceof Error ? error.message : String(error),
        }
      )
    );
  }
};
