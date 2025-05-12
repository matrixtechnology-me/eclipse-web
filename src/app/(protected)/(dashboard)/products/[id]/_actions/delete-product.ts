"use server";

import { CACHE_TAGS } from "@/config/cache-tags";
import { failure, Action, success } from "@/core/action";
import { InternalServerError, NotFoundError } from "@/errors";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";

export type DeleteProductActionPayload = {
  productId: string;
  tenantId: string;
};

export const deleteProductAction: Action<DeleteProductActionPayload> = async ({
  productId,
  tenantId,
}) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
        tenantId,
      },
    });

    if (!product) return failure(new NotFoundError("product not found"));

    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    revalidateTag(
      CACHE_TAGS.TENANT(tenantId).PRODUCTS.PRODUCT(productId).INDEX
    );

    return success({});
  } catch (error) {
    console.error(error);
    return failure(
      new InternalServerError(
        "unable to delete product because error: " + error
      )
    );
  }
};
