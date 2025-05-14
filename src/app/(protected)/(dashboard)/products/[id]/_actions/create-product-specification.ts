"use server";

import { CACHE_TAGS } from "@/config/cache-tags";
import { failure, Action, success } from "@/lib/action";
import { InternalServerError, NotFoundError } from "@/errors";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";

type CreateProductSpecificationActionPayload = {
  label: string;
  value: string;
  productId: string;
  tenantId: string;
};

type CreateProductSpecificationActionResult = {};

export const createProductSpecificationAction: Action<
  CreateProductSpecificationActionPayload,
  CreateProductSpecificationActionResult
> = async ({ label, productId, value, tenantId }) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
        tenantId,
      },
    });

    if (!product) return failure(new NotFoundError("product not found"));

    await prisma.productSpecification.create({
      data: {
        label,
        value,
        productId,
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
        "unable to create a new product specification because error: " + error
      )
    );
  }
};
