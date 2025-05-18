"use server";

import { InternalServerError } from "@/errors";
import { Action, failure, success } from "@/lib/action";
import prisma from "@/lib/prisma";
import { ESaleStatus } from "@prisma/client";

type GetCategoriesActionPayload = {
  tenantId: string;
};

export type Category = {
  id: string;
  name: string;
  salesTotal: number;
};

type GetCategoriesActionResult = {
  categories: Category[];
};

export const getCategoriesAction: Action<
  GetCategoriesActionPayload,
  GetCategoriesActionResult
> = async ({ tenantId }) => {
  try {
    const items = await prisma.saleProduct.findMany({
      where: {
        sale: {
          tenantId,
          status: ESaleStatus.Processed,
        },
        product: {
          categoryId: {
            not: null,
          },
        },
      },
      select: {
        totalQty: true,
        salePrice: true,
        product: {
          select: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const categoryMap = new Map<
      string,
      { id: string; name: string; total: number }
    >();

    for (const item of items) {
      const category = item.product.category;
      if (!category) continue;

      const subtotal = item.salePrice.toNumber() * item.totalQty;

      if (!categoryMap.has(category.id)) {
        categoryMap.set(category.id, {
          id: category.id,
          name: category.name,
          total: subtotal,
        });
      } else {
        const existing = categoryMap.get(category.id)!;
        existing.total += subtotal;
      }
    }

    const categories: Category[] = Array.from(categoryMap.values())
      .sort((a, b) => b.total - a.total)
      .map((c) => ({
        id: c.id,
        name: c.name,
        salesTotal: c.total,
      }));

    return success({ categories });
  } catch (error) {
    console.error(error);
    return failure(new InternalServerError("cannot get categories"));
  }
};
