"use server";

import { CACHE_TAGS } from "@/config/cache-tags";
import { failure, ServerAction, success } from "@/core/server-actions";
import { InternalServerError, NotFoundError } from "@/errors";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";

type DeleteProductSpecificationActionPayload = {
  specificationId: string;
  tenantId: string;
  productId: string;
};

export const deleteProductSpecificationAction: ServerAction<
  DeleteProductSpecificationActionPayload
> = async ({ specificationId, tenantId, productId }) => {
  try {
    const productSpecification = await prisma.productSpecification.findUnique({
      where: {
        id: specificationId,
      },
    });

    if (!productSpecification)
      return failure(new NotFoundError("product specification not found"));

    await prisma.productSpecification.delete({
      where: {
        id: specificationId,
      },
    });

    revalidateTag(
      CACHE_TAGS.TENANT(tenantId).PRODUCTS.PRODUCT(productId).SPECIFICATIONS
    );

    return success({});
  } catch (error) {
    console.error(error);
    return failure(
      new InternalServerError(
        "unable to delete a product specification because error: " + error
      )
    );
  }
};
