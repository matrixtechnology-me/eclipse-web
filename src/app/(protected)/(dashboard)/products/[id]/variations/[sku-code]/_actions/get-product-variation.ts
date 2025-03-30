import { NotFoundError } from "@/errors/not-found";
import prisma from "@/lib/prisma";
import { ServerAction } from "@/types/server-actions";
import { reportError } from "@/utils/report-error";
import { EStockStrategy } from "@prisma/client";

type GetProductVariationActionPayload = {
  skuCode: string;
};

type GetProductVariationActionResult = {
  productVariation: {
    id: string;
    skuCode: string;
    salePrice: number;
    productId: string;
    createdAt: Date;
    updatedAt: Date;
    specifications: {
      id: string;
      label: string;
      value: string;
    }[];
    stock: {
      id: string;
      totalQty: number;
      availableQty: number;
      strategy: EStockStrategy;
      lots: {
        id: string;
        totalQty: number;
        costPrice: number;
        lotNumber: string;
        expiresAt?: Date;
        createdAt: Date;
        updatedAt: Date;
      }[];
    };
  };
};

export const getProductVariation: ServerAction<
  GetProductVariationActionPayload,
  GetProductVariationActionResult
> = async ({ skuCode }) => {
  try {
    const productVariation = await prisma.productVariation.findUnique({
      where: {
        skuCode,
      },
      include: {
        specifications: true,
        stock: {
          include: {
            lots: true,
          },
        },
      },
    });

    if (!productVariation)
      throw new NotFoundError("product variation not found");

    if (!productVariation.stock)
      throw new NotFoundError("product variation stock not found");

    return {
      data: {
        productVariation: {
          id: productVariation.id,
          skuCode: productVariation.skuCode,
          salePrice: productVariation.salePrice.toNumber(),
          productId: productVariation.productId,
          createdAt: productVariation.createdAt,
          updatedAt: productVariation.updatedAt,
          specifications: productVariation.specifications.map(
            (specification) => ({
              id: specification.id,
              label: specification.label,
              value: specification.value,
            })
          ),
          stock: {
            id: productVariation.stock.id,
            availableQty: productVariation.stock.availableQty,
            strategy: productVariation.stock.strategy,
            totalQty: productVariation.stock.totalQty,
            lots:
              productVariation.stock.lots.map((lot) => ({
                costPrice: lot.costPrice.toNumber(),
                id: lot.id,
                lotNumber: lot.lotNumber,
                totalQty: lot.totalQty,
                expiresAt: lot.expiresAt ?? undefined,
                createdAt: lot.createdAt,
                updatedAt: lot.updatedAt,
              })) ?? [],
          },
        },
      },
    };
  } catch (error) {
    return reportError(error);
  }
};
