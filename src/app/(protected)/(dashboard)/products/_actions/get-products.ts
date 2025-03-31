"use server";

import { NotFoundError } from "@/errors/not-found";
import prisma from "@/lib/prisma";
import { ServerAction } from "@/types/server-actions";
import { reportError } from "@/utils/report-error";

type GetProductsActionPayload = {};

type GetProductsActionResult = {
  products: {
    id: string;
    name: string;
    barCode: string;
    active: boolean;
    salePrice: number;
  }[];
};

export const getProducts: ServerAction<
  GetProductsActionPayload,
  GetProductsActionResult
> = async () => {
  try {
    const products = await prisma.product.findMany();

    if (!products?.length) throw new NotFoundError();

    return {
      data: {
        products: products.map((product) => ({
          id: product.id,
          active: product.active,
          barCode: product.barCode,
          name: product.name,
          salePrice: product.salePrice.toNumber(),
        })),
      },
    };
  } catch (error) {
    return reportError(error);
  }
};
