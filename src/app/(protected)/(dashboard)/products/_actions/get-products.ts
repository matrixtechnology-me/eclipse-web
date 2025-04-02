"use server";

import { NotFoundError } from "@/errors";
import prisma from "@/lib/prisma";
import { ServerAction, success, failure } from "@/core/server-actions";
import { reportError } from "@/utils/report-error.util";

export type ProductListItem = {
  id: string;
  name: string;
  barCode: string;
  active: boolean;
  salePrice: number;
};

export const getProducts: ServerAction<void, ProductListItem[]> = async () => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: "asc" },
      where: { active: true },
    });

    if (!products.length) {
      return failure(new NotFoundError("No active products found"));
    }

    return success(
      products.map((product) => ({
        id: product.id,
        name: product.name,
        barCode: product.barCode,
        active: product.active,
        salePrice: product.salePrice.toNumber(),
      }))
    );
  } catch (error: unknown) {
    console.error("Failed to fetch products:", error);
    return reportError(error);
  }
};
