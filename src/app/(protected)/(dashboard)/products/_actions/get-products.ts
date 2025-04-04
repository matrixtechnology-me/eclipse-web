"use server";

import { InternalServerError, NotFoundError } from "@/errors";
import prisma from "@/lib/prisma";
import { ServerAction, success, failure } from "@/core/server-actions";

export type ProductListItem = {
  id: string;
  name: string;
  barCode: string;
  active: boolean;
  salePrice: number;
};

export const getProducts: ServerAction<
  { tenantId: string },
  { products: ProductListItem[] }
> = async ({ tenantId }) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: "asc" },
      where: { active: true, tenantId },
    });

    if (!products.length) {
      return failure(new NotFoundError("No active products found"));
    }

    return success({
      products: products.map((product) => ({
        id: product.id,
        name: product.name,
        barCode: product.barCode,
        active: product.active,
        salePrice: product.salePrice.toNumber(),
      })),
    });
  } catch (error: unknown) {
    console.error("Failed to fetch products:", error);
    return failure(
      new InternalServerError("Ocorreu um erro durante o registro", {
        originalError: error instanceof Error ? error.message : String(error),
      })
    );
  }
};
