"use server";

import prisma from "@/lib/prisma";
import { ServerAction } from "@/types/server-actions";
import { propagateError } from "@/utils/propagate-error";
import { EStockStrategy } from "@prisma/client";

type CreateProductActionPayload = {
  name: string;
  description: string;
  variations: {
    salePrice: number;
    costPrice: number;
    specifications: {
      label: string;
      value: string;
    }[];
  }[];
  tenantId: string;
};

type CreateProductActionResult = {};

export const createProduct: ServerAction<
  CreateProductActionPayload,
  CreateProductActionResult
> = async ({ description, name, variations, tenantId }) => {
  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        tenantId,
      },
    });

    await Promise.all(
      variations.map(
        async (variation) =>
          await prisma.productVariation.create({
            data: {
              skuCode: Math.floor(Math.random() * 0xffffffffffff)
                .toString(16)
                .padStart(12, "0"),
              salePrice: variation.salePrice,
              productId: product.id,
              specifications: {
                createMany: {
                  data: variation.specifications.map((specification) => ({
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
          })
      )
    );

    return { data: {} };
  } catch (error) {
    console.log(error);
    return propagateError(error as Error);
  }
};
