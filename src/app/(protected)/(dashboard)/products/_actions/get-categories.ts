"use server";

import { Action, failure, success } from "@/lib/action";
import { InternalServerError } from "@/errors";
import prisma from "@/lib/prisma";
import { unstable_cacheTag as cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/config/cache-tags";

type GetCategoriesPayload = {
  tenantId: string;
};

type GetCategoriesResult = {
  categories: {
    id: string;
    name: string;
    description: string | null;
  }[];
};

export const getCategoriesAction: Action<
  GetCategoriesPayload,
  GetCategoriesResult
> = async ({ tenantId }) => {
  "use cache";
  cacheTag(CACHE_TAGS.TENANT(tenantId).PRODUCTS.CATEGORIES.GENERAL);

  try {
    const categories = await prisma.productCategory.findMany({
      where: {
        tenantId,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    return success({ categories });
  } catch (error) {
    console.error(error);
    return failure(
      new InternalServerError("Erro ao buscar categorias de produto", {
        originalError: error instanceof Error ? error.message : String(error),
      })
    );
  }
};
