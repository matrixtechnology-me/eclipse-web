"use server";

import { CACHE_TAGS } from "@/config/cache-tags";
import { failure, Action, success } from "@/lib/action";
import { InternalServerError, NotFoundError } from "@/errors";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";

type DeleteProductCompositionActionPayload = {
  compositionId: string;
  tenantId: string;
  productId: string;
};

export const deleteProductCompositionAction: Action<
  DeleteProductCompositionActionPayload
> = async ({ compositionId, tenantId, productId }) => {
  try {
    const productComposition = await prisma.productComposition.findUnique({
      where: {
        id: compositionId,
      },
    });

    if (!productComposition)
      return failure(new NotFoundError("product composition not found"));

    await prisma.productComposition.delete({
      where: {
        id: compositionId,
      },
    });

    revalidateTag(
      CACHE_TAGS.TENANT(tenantId).PRODUCTS.PRODUCT(productId).COMPOSITIONS
    );

    return success({});
  } catch (error) {
    console.error(error);
    return failure(
      new InternalServerError(
        "unable to delete a product composition because error: " + error
      )
    );
  }
};
