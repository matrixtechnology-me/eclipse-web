"use server";

import { Action, failure, success } from "@/lib/action";
import { InternalServerError, NotFoundError } from "@/errors";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/cache-tags";
import { Prisma } from "@prisma/client";

type UpdateProductCategoryActionPayload = {
  productId: string;
  tenantId: string;
  categoryId: string;
};

type UpdateProductCategoryActionResult = {};

const revalidateTags = (productId: string, tenantId: string) => {
  revalidateTag(CACHE_TAGS.TENANT(tenantId).PRODUCTS.INDEX.ALL);
  revalidateTag(CACHE_TAGS.TENANT(tenantId).PRODUCTS.PRODUCT(productId).INDEX);
};

export const updateProductCategoryAction: Action<
  UpdateProductCategoryActionPayload,
  UpdateProductCategoryActionResult
> = async ({ productId, tenantId, categoryId }) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) return failure(new NotFoundError("Product not found"));

    const category = await prisma.productCategory.findUnique({
      where: {
        id: categoryId,
      },
      include: {
        productCategorySubcategories: true,
      },
    });

    if (!category) return failure(new NotFoundError("Product not found"));

    let updateProductData: Prisma.XOR<
      Prisma.ProductUpdateInput,
      Prisma.ProductUncheckedUpdateInput
    > = {
      categoryId,
    };

    if (
      product.subcategoryId &&
      !category.productCategorySubcategories.some(
        (pcs) => pcs.subcategoryId === product.subcategoryId
      )
    ) {
      updateProductData.subcategoryId = null;
    }

    await prisma.product.update({
      where: {
        id: productId,
        tenantId,
      },
      data: updateProductData,
    });

    revalidateTags(productId, tenantId);

    return success({});
  } catch (error) {
    console.error(error);
    return failure(
      new InternalServerError("Erro ao atualizar a categoria do produto")
    );
  }
};
