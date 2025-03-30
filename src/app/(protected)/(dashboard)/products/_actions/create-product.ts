"use server";

import prisma from "@/lib/prisma";
import { ServerAction } from "@/types/server-actions";
import { propagateError } from "@/utils/propagate-error";
import { EStockStrategy } from "@prisma/client";

type CreateProductActionPayload = {
  name: string;
  description: string;
  salePrice: number;
  costPrice: number;
  barCode: string;
  specifications: {
    label: string;
    value: string;
  }[];
  tenantId: string;
};

type CreateProductActionResult = {};

export const createProduct: ServerAction<
  CreateProductActionPayload,
  CreateProductActionResult
> = async ({
  description,
  name,
  tenantId,
  costPrice,
  salePrice,
  specifications,
  barCode,
}) => {
  try {
    await prisma.product.create({
      data: {
        name,
        description,
        tenantId,
        skuCode: Math.floor(Math.random() * 0xffffffffffff)
          .toString(16)
          .padStart(12, "0"),
        salePrice,
        barCode,
        specifications: {
          createMany: {
            data: specifications.map((specification) => ({
              label: specification.label,
              value: specification.value,
            })),
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

    return { data: {} };
  } catch (error) {
    console.log(error);
    return propagateError(error as Error);
  }
};
