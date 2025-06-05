"use server";

import { Action, failure, success } from "@/lib/action";
import { InternalServerError } from "@/errors";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/cache-tags";

type UpdateProductCategoryActionPayload = {
  productId: string;
  tenantId: string;
  categoryId: string | null;
};

type UpdateProductCategoryActionResult = {};

export const updateProductCategoryAction: Action<
  UpdateProductCategoryActionPayload,
  UpdateProductCategoryActionResult
> = async ({ productId, tenantId, categoryId }) => {
  try {
    await prisma.product.update({
      where: {
        id: productId,
        tenantId,
      },
      data: {
        categoryId,
      },
    });

    revalidateTag(CACHE_TAGS.TENANT(tenantId).PRODUCTS.INDEX.ALL);
    revalidateTag(
      CACHE_TAGS.TENANT(tenantId).PRODUCTS.PRODUCT(productId).INDEX
    );

    return success({});
  } catch (error) {
    console.error(error);
    return failure(
      new InternalServerError("Erro ao atualizar a categoria do produto")
    );
  }
};
