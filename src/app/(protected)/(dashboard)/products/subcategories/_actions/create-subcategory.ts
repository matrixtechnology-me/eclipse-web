"use server";

import { CACHE_TAGS } from "@/config/cache-tags";
import { InternalServerError, NotFoundError } from "@/errors";
import { Action, failure, success } from "@/lib/action";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";

type CreateSubcategoryActionPayload = {
  name: string;
  description: string;
  categoryId: string;
  tenantId: string;
};

export const createSubcategoryAction: Action<
  CreateSubcategoryActionPayload
> = async ({ description, name, tenantId, categoryId }) => {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: {
        id: tenantId,
      },
      select: {
        id: true,
      },
    });

    if (!tenant) return failure(new NotFoundError("tenant not found"));

    const category = await prisma.productCategory.findUnique({
      where: {
        id: categoryId,
      },
      select: {
        id: true,
      },
    });

    if (!category)
      return failure(new NotFoundError("product category not found"));

    await prisma.productSubcategory.create({
      data: {
        name,
        description,
        tenantId,
        categoryId,
      },
    });

    revalidateTag(CACHE_TAGS.TENANT(tenantId).PRODUCTS.SUBCATEGORIES.INDEX.ALL);

    return success({});
  } catch (error) {
    console.error(error);
    return failure(new InternalServerError());
  }
};
