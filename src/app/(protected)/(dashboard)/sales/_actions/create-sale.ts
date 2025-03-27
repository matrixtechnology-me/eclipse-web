"use server";

import prisma from "@/lib/prisma";
import { ServerAction } from "@/types/server-actions";
import { propagateError } from "@/utils/propagate-error";

type CreateSaleActionPayload = {
  customerId: string;
  products: {
    id: string;
    quantity: number;
  }[];
};

type CreateSaleActionResult = {};

export const createSale: ServerAction<
  CreateSaleActionPayload,
  CreateSaleActionResult
> = async ({ customerId, products }) => {
  try {
    const existingProducts = await prisma.product.findMany({
      where: {
        id: {
          in: products.map((product) => product.id),
        },
      },
    });

    console.log(existingProducts);

    await prisma.sale.create({
      data: {
        customerId,
        products: {
          createMany: {
            data: existingProducts.map((product) => {
              const selectedProduct = products.find((p) => p.id === product.id);
              return {
                costPrice: product.costPrice,
                name: product.name,
                productId: product.id,
                salePrice: product.salePrice,
                description: product.description,
                quantity: selectedProduct?.quantity ?? 1,
              };
            }),
          },
        },
      },
    });

    await Promise.all(
      products.map(({ id, quantity }) =>
        prisma.product.update({
          where: { id },
          data: { quantity: { decrement: quantity } },
        })
      )
    );

    return { data: {} };
  } catch (error) {
    return propagateError(error as Error);
  }
};
