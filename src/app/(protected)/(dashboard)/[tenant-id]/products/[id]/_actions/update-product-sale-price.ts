"use server";

import { NotFoundError } from "@/errors/http/not-found.error";
import prisma from "@/lib/prisma";
import { Action, success, failure } from "@/core/action";
import { InternalServerError } from "@/errors";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/cache-tags";

type UpdateProductSalePricePayload = {
  productId: string;
  tenantId: string;
  value: number;
};

export const updateProductSalePriceAction: Action<
  UpdateProductSalePricePayload,
  void
> = async ({ productId, tenantId, value }) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId, tenantId },
    });

    if (!product) {
      return failure(new NotFoundError("product not found"));
    }

    await prisma.product.update({
      where: { id: productId },
      data: { salePrice: value },
    });

    revalidateTag(
      CACHE_TAGS.TENANT(tenantId).PRODUCTS.PRODUCT(productId).INDEX
    );

    return success(undefined);
  } catch (error: unknown) {
    console.error("Failed to update sale price:", error);
    return failure(
      new InternalServerError("Erro ao atualizar preço de venda", {
        originalError: error instanceof Error ? error.message : String(error),
      })
    );
  }
};
