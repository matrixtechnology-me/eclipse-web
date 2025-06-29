"use server";

import { NotFoundError } from "@/errors/http/not-found.error";
import prisma from "@/lib/prisma";
import { Action, success, failure } from "@/lib/action";
import { EStockStrategy } from "@prisma/client";
import { InternalServerError } from "@/errors";

export type ProductCategory = {
  id: string;
  name: string;
};

export type ProductSubcategory = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  active: boolean;
  skuCode: string;
  category: ProductCategory | null;
  subcategory: ProductSubcategory | null;
  salePrice: number;
  createdAt: Date;
  updatedAt: Date;
  specifications: Array<{
    id: string;
    label: string;
    value: string;
  }>;
  stock: {
    id: string;
    totalQty: number;
    availableQty: number;
    strategy: EStockStrategy;
    lots: Array<{
      id: string;
      totalQty: number;
      costPrice: number;
      lotNumber: string;
      expiresAt?: Date;
      createdAt: Date;
      updatedAt: Date;
    }>;
  };
  attachments: {
    id: string;
    name: string;
    size: bigint;
    type: string;
    url: string;
  }[];
};

type GetProductActionPayload = {
  id: string;
};

type GetProductActionResult = {
  product: Product;
};

export const getProduct: Action<
  GetProductActionPayload,
  GetProductActionResult
> = async ({ id }) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id, deletedAt: null },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        subcategory: {
          select: {
            id: true,
            name: true,
          },
        },
        productAttachments: {
          select: {
            id: true,
            file: true,
          },
        },
        specifications: {
          select: {
            id: true,
            label: true,
            value: true,
          },
        },
        stock: {
          include: {
            lots: {
              orderBy: {
                createdAt: "desc",
              },
              select: {
                id: true,
                totalQty: true,
                costPrice: true,
                lotNumber: true,
                expiresAt: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      return failure(new NotFoundError("Product not found"));
    }

    if (!product.stock) {
      return failure(new NotFoundError("Product stock not found"));
    }

    const productDetails: Product = {
      id: product.id,
      name: product.name,
      description: product.description,
      active: product.active,
      skuCode: product.skuCode,
      salePrice: product.salePrice.toNumber(),
      category: product.category,
      subcategory: product.subcategory,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      specifications: product.specifications,
      stock: {
        id: product.stock.id,
        totalQty: product.stock.totalQty,
        availableQty: product.stock.availableQty,
        strategy: product.stock.strategy,
        lots: product.stock.lots.map((lot) => ({
          id: lot.id,
          totalQty: lot.totalQty,
          costPrice: lot.costPrice.toNumber(),
          lotNumber: lot.lotNumber,
          expiresAt: lot.expiresAt ?? undefined,
          createdAt: lot.createdAt,
          updatedAt: lot.updatedAt,
        })),
      },
      attachments: product.productAttachments.map((attachment) => ({
        id: attachment.id,
        name: attachment.file.name,
        size: attachment.file.size,
        type: attachment.file.mimeType,
        url: attachment.file.url,
      })),
    };

    return success({ product: productDetails });
  } catch (error: unknown) {
    console.error(`Failed to fetch product ${id}:`, error);
    return failure(
      new InternalServerError("Ocorreu um erro durante o registro", {
        originalError: error instanceof Error ? error.message : String(error),
      })
    );
  }
};
