"use server";

import prisma from "@/lib/prisma";
import { ServerAction } from "@/types/server-actions";
import { propagateError } from "@/utils/propagate-error";

type CreateProductActionPayload = {
  name: string;
  description: string;
  costPrice: number;
  salePrice: number;
  quantity: number;
};

type CreateProductActionResult = {};

export const createProduct: ServerAction<
  CreateProductActionPayload,
  CreateProductActionResult
> = async ({ costPrice, description, name, salePrice, quantity }) => {
  try {
    await prisma.product.create({
      data: {
        costPrice,
        name,
        salePrice,
        description,
        quantity,
      },
    });

    return { data: {} };
  } catch (error) {
    return propagateError(error as Error);
  }
};
