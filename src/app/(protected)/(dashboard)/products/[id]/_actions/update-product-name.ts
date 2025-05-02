"use server";

import { NotFoundError } from "@/errors/http/not-found.error";
import prisma from "@/lib/prisma";
import { ServerAction, success, failure } from "@/core/server-actions";
import { InternalServerError } from "@/errors";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/cache-tags";

type UpdateProductNameActionPayload = {
  productId: string;
  tenantId: string;
  value: string;
};

export const updateProductNameAction: ServerAction<
  UpdateProductNameActionPayload,
  void
> = async ({ value, productId, tenantId }) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId, tenantId },
    });

    if (!product) {
      return failure(new NotFoundError("product not found"));
    }

    await prisma.product.update({
      where: { id: productId },
      data: { name: value },
    });

    revalidateTag(
      CACHE_TAGS.TENANT(tenantId).PRODUCTS.PRODUCT(productId).INDEX
    );

    return success(undefined);
  } catch (error: unknown) {
    console.error("Failed to update product name:", error);
    return failure(
      new InternalServerError("Ocorreu um erro durante o registro", {
        originalError: error instanceof Error ? error.message : String(error),
      })
    );
  }
};
