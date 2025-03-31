import { NotFoundError } from "@/errors/not-found";
import prisma from "@/lib/prisma";
import { ServerAction } from "@/types/server-actions";
import { propagateError } from "@/utils/propagate-error";
import { reportError } from "@/utils/report-error";
import { EStockStrategy } from "@prisma/client";

type GetProductsActionPayload = {
  id: string;
};

type GetProductsActionResult = {
  product: {
    id: string;
    name: string;
    description: string;
    active: boolean;
    skuCode: string;
    salePrice: number;
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

export const getProduct: ServerAction<
  GetProductsActionPayload,
  GetProductsActionResult
> = async ({ id }) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id,
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

    if (!product) throw new NotFoundError({ message: "product not found" });

    if (!product.stock)
      throw new NotFoundError({ message: "product variation stock not found" });

    return {
      data: {
        product: {
          id: product.id,
          name: product.name,
          description: product.description,
          active: product.active,
          skuCode: product.skuCode,
          salePrice: product.salePrice.toNumber(),
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          specifications: product.specifications.map((specification) => ({
            id: specification.id,
            label: specification.label,
            value: specification.value,
          })),
          stock: {
            id: product.stock.id,
            availableQty: product.stock.availableQty,
            strategy: product.stock.strategy,
            totalQty: product.stock.totalQty,
            lots:
              product.stock.lots.map((lot) => ({
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
    const expectedErrors = [NotFoundError.name];
    return expectedErrors.includes((error as Error).name)
      ? propagateError(error as Error)
      : reportError(error as Error);
  }
};
