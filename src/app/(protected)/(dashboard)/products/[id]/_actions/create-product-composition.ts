"use server";

import { CACHE_TAGS } from "@/config/cache-tags";
import { failure, Action, success } from "@/lib/action";
import { InternalServerError, NotFoundError } from "@/errors";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";

type CreateProductCompositionActionPayload = {
  totalQty: number;
  parentId: string;
  childId: string;
  tenantId: string;
};

type CreateProductCompositionActionResult = {};

export const createProductCompositionAction: Action<
  CreateProductCompositionActionPayload,
  CreateProductCompositionActionResult
> = async ({ tenantId, childId, parentId, totalQty }) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: parentId,
        tenantId,
      },
    });

    if (!product) return failure(new NotFoundError("product not found"));

    await prisma.productComposition.create({
      data: {
        parentId,
        childId,
        totalQty,
      },
    });

    revalidateTag(
      CACHE_TAGS.TENANT(tenantId).PRODUCTS.PRODUCT(parentId).COMPOSITIONS
    );

    return success({});
  } catch (error) {
    console.error(error);
    return failure(
      new InternalServerError(
        "unable to create a new product composition because error: " + error
      )
    );
  }
};
