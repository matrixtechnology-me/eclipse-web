"use server";

import prisma from "@/lib/prisma";
import { EStockStrategy, Prisma } from "@prisma/client";
import { failure, Action, success } from "@/lib/action";
import { InternalServerError } from "@/errors";

type GetProductsActionPayload = {
  searchValue: string;
  page: number;
  limit: number;
  active: boolean;
  tenantId: string;
};

export type Product = {
  id: string;
  name: string;
  costPrice: number;
  salePrice: number;
  availableQty: number;
};

export type ProductsWithPagination = {
  results: Product[];
  pagination: {
    limit: number;
    currentPage: number;
    totalItems: number;
    totalPages: number;
  };
};

async function hasStockInComposition(
  productId: string,
  tenantId: string,
  parentQuantity: number = 1
): Promise<boolean> {
  const product = await prisma.product.findUnique({
    where: { id: productId, tenantId },
    include: {
      parentCompositions: {
        include: {
          child: {
            include: {
              stock: {
                include: {
                  lots: true,
                },
              },
            },
          },
        },
      },
      stock: {
        include: {
          lots: true,
        },
      },
    },
  });

  if (!product) return false;

  const availableQty =
    product.stock?.lots.reduce((sum, lot) => sum + lot.totalQty, 0) ?? 0;
  if (availableQty < parentQuantity) return false;

  for (const composition of product.parentCompositions) {
    const childQuantity = parentQuantity * composition.totalQty.toNumber();
    const childHasStock = await hasStockInComposition(
      composition.child.id,
      tenantId,
      childQuantity
    );
    if (!childHasStock) return false;
  }

  return true;
}

export const getProducts: Action<
  GetProductsActionPayload,
  ProductsWithPagination
> = async ({ searchValue, page, limit, active, tenantId }) => {
  try {
    const skip = (page - 1) * limit;

    const whereCondition: Prisma.ProductWhereInput = {
      tenantId,
      AND: [
        searchValue
          ? {
              OR: [
                { name: { contains: searchValue, mode: "insensitive" } },
                { description: { contains: searchValue, mode: "insensitive" } },
                { skuCode: { contains: searchValue, mode: "insensitive" } },
              ],
            }
          : {},
        { active },
      ],
    };

    const rawProducts = await prisma.product.findMany({
      where: whereCondition,
      skip,
      take: limit,
      include: {
        stock: {
          select: {
            strategy: true,
            lots: {
              select: {
                costPrice: true,
                expiresAt: true,
                totalQty: true,
              },
              orderBy: {
                expiresAt: "asc",
              },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    console.log("RAW PRODUCTS", rawProducts);

    const productsWithStock = await Promise.all(
      rawProducts.map(async (product) => {
        const hasStock = await hasStockInComposition(product.id, tenantId);
        return hasStock ? product : null;
      })
    );

    const filteredProducts = productsWithStock.filter(
      Boolean
    ) as typeof rawProducts;

    const results = filteredProducts.map((product) => {
      const strategy = product.stock?.strategy;
      const lots = product.stock?.lots || [];

      const sortedLots =
        strategy === EStockStrategy.Lifo ? [...lots].reverse() : lots;

      const totalAvailable = lots.reduce((sum, lot) => sum + lot.totalQty, 0);

      return {
        id: product.id,
        name: product.name,
        costPrice: sortedLots[0]?.costPrice.toNumber() ?? 0,
        salePrice: product.salePrice.toNumber(),
        availableQty: totalAvailable,
      };
    });

    return success({
      results,
      pagination: {
        limit,
        currentPage: page,
        totalItems: results.length,
        totalPages: Math.ceil(results.length / limit),
      },
    });
  } catch (error: unknown) {
    console.error("Failed to fetch products:", error);
    return failure(new InternalServerError());
  }
};
