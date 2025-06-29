"use server";

import { Action, failure, success } from "@/lib/action";
import { InternalServerError } from "@/errors";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/cache-tags";

type UpdateProductSubcategoryActionPayload = {
  productId: string;
  tenantId: string;
  subcategoryId: string | null;
};

type UpdateProductSubcategoryActionResult = {};

export const updateProductSubcategoryAction: Action<
  UpdateProductSubcategoryActionPayload,
  UpdateProductSubcategoryActionResult
> = async ({ productId, tenantId, subcategoryId }) => {
  try {
    await prisma.product.update({
      where: {
        id: productId,
        tenantId,
      },
      data: {
        subcategoryId,
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
