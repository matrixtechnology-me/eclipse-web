"use server";

import prisma from "@/lib/prisma";
import { failure, ServerAction, success } from "@/core/server-actions";
import { BadRequestError, ConflictError, InternalServerError } from "@/errors";
import { EStockStrategy } from "@prisma/client";

export const createProduct: ServerAction<
  {
    name: string;
    description: string;
    salePrice: number;
    barCode: string;
    specifications: Array<{ label: string; value: string }>;
    tenantId: string;
  },
  void
> = async ({
  name,
  description,
  tenantId,
  salePrice,
  specifications,
  barCode,
}) => {
  try {
    if (!name || !tenantId || salePrice <= 0) {
      throw new BadRequestError("Invalid input parameters");
    }

    const existingProduct = await prisma.product.findFirst({
      where: { OR: [{ name }, { barCode }], tenantId },
    });
    if (existingProduct) throw new ConflictError("Product already exists");

    await prisma.product.create({
      data: {
        name,
        description,
        tenantId,
        skuCode: generateSkuCode(),
        salePrice,
        barCode,
        specifications: {
          createMany: {
            data: specifications,
          },
        },
        stock: {
          create: {
            strategy: EStockStrategy.Fifo,
            availableQty: 0,
            totalQty: 0,
            tenantId,
          },
        },
      },
    });

    return success(undefined);
  } catch (error: unknown) {
    console.error("Failed to create product:", error);
    return failure(new InternalServerError());
  }
};

function generateSkuCode(): string {
  return Math.floor(Math.random() * 0xffffffffffff)
    .toString(16)
    .padStart(12, "0");
}
