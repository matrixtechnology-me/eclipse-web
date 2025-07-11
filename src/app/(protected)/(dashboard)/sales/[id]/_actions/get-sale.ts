import { failure, Action, success } from "@/lib/action";
import { InternalServerError, NotFoundError } from "@/errors";
import prisma from "@/lib/prisma";
import { EPaymentMethod, ESaleMovementType } from "@prisma/client";

type GetSaleActionPayload = {
  tenantId: string;
  saleId: string;
};

type Movement = {
  id: string;
  type: ESaleMovementType;
  method: EPaymentMethod;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
};

type Product = {
  id: string;
  name: string;
  totalQty: number;
  salePrice: number;
  costPrice: number;
  stockLotUsages: Array<{
    lotNumber: string;
    quantity: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
};

type GetSaleActionResult = {
  sale: {
    id: string;
    customer: {
      id: string;
      name: string;
      phoneNumber: string;
    };
    movements: Movement[];
    products: Product[];
  };
};

export const getSaleAction: Action<
  GetSaleActionPayload,
  GetSaleActionResult
> = async ({ saleId, tenantId }) => {
  try {
    const sale = await prisma.sale.findUnique({
      where: {
        id: saleId,
        tenantId,
      },
      select: {
        id: true,
        customer: {
          select: {
            id: true,
            name: true,
            phoneNumber: true,
          },
        },
        movements: {
          select: {
            id: true,
            type: true,
            change: true,
            payment: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        products: {
          select: {
            id: true,
            name: true,
            totalQty: true,
            salePrice: true,
            stockLotUsages: {
              select: {
                quantity: true,
                stockLot: {
                  select: {
                    costPrice: true,
                    lotNumber: true,
                  },
                },
              },
            },
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!sale) return failure(new NotFoundError("sale not found"));

    const mappedMovements: Movement[] = [];

    for (const mv of sale.movements) {
      const source = mv.payment ?? mv.change;

      if (!source) continue;

      mappedMovements.push({
        id: mv.id,
        type: mv.type,
        method: source.method,
        amount: source.amount.toNumber(),
        createdAt: mv.createdAt,
        updatedAt: mv.updatedAt,
      });
    }

    // TODO: handle numeric operations with precision.
    const mappedProducts = sale.products.map((pd): Product => {
      const costPrice = pd.stockLotUsages.reduce(
        (prodAcc, { quantity, stockLot }) => {
          return prodAcc + stockLot.costPrice.toNumber() * quantity
        }, 0);

      return {
        id: pd.id,
        name: pd.name,
        totalQty: pd.totalQty,
        salePrice: pd.salePrice.toNumber(),
        costPrice,
        stockLotUsages: pd.stockLotUsages.map(u => ({
          lotNumber: u.stockLot.lotNumber,
          quantity: u.quantity,
        })),
        createdAt: pd.createdAt,
        updatedAt: pd.updatedAt,
      };
    });

    return success({
      sale: {
        id: sale.id,
        customer: {
          id: sale.customer.id,
          name: sale.customer.name,
          phoneNumber: sale.customer.phoneNumber ?? "00000000000",
        },
        movements: mappedMovements,
        products: mappedProducts,
      },
    });
  } catch (error) {
    console.error(error);
    return failure(
      new InternalServerError("unable to get sale with id " + saleId)
    );
  }
};
