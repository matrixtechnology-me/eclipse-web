"use server";

import { CACHE_TAGS } from "@/config/cache-tags";
import { InternalServerError } from "@/errors";
import { Action, failure, success } from "@/lib/action";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";

type CreateCategoryActionPayload = {
  name: string;
  description: string;
  tenantId: string;
};

export const createCategoryAction: Action<
  CreateCategoryActionPayload
> = async ({ description, name, tenantId }) => {
  try {
    await prisma.productCategory.create({
      data: {
        name,
        description,
        tenantId,
      },
    });

    revalidateTag(CACHE_TAGS.TENANT(tenantId).PRODUCTS.CATEGORIES.INDEX.ALL);

    return success({});
  } catch (error) {
    console.error(error);
    return failure(new InternalServerError());
  }
};
