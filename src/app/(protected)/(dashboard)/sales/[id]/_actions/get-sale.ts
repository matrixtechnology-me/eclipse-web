import { failure, Action, success } from "@/core/action";
import { InternalServerError, NotFoundError } from "@/errors";
import prisma from "@/lib/prisma";

type GetSaleActionPayload = {
  tenantId: string;
  saleId: string;
};

type GetSaleActionResult = {
  sale: {
    id: string;
    customer: {
      id: string;
      name: string;
      phoneNumber: string;
    };
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
      },
    });

    if (!sale) return failure(new NotFoundError("sale not found"));

    return success({
      sale: {
        id: sale.id,
        customer: {
          id: sale.customer.id,
          name: sale.customer.name,
          phoneNumber: sale.customer.phoneNumber ?? "00000000000",
        },
      },
    });
  } catch (error) {
    console.error(error);
    return failure(
      new InternalServerError("unable to get sale with id " + saleId)
    );
  }
};
