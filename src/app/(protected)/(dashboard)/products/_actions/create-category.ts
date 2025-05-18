"use server";

import { failure, Action, success } from "@/lib/action";
import { InternalServerError } from "@/errors";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/cache-tags";

type CreateProductCategoryPayload = {
  name: string;
  description: string;
  tenantId: string;
};

type CreateProductCategoryResult = {
  categoryId: string;
};

export const createProductCategory: Action<
  CreateProductCategoryPayload,
  CreateProductCategoryResult
> = async ({ name, description, tenantId }) => {
  try {
    const category = await prisma.productCategory.create({
      data: {
        name,
        description,
        tenantId,
      },
    });

    revalidateTag(CACHE_TAGS.TENANT(tenantId).PRODUCTS.CATEGORIES.GENERAL);

    return success({ categoryId: category.id });
  } catch (error) {
    console.error(error);
    return failure(
      new InternalServerError("cannot create product category: " + error)
    );
  }
};
