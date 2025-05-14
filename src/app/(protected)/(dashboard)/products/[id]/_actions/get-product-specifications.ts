import { CACHE_TAGS } from "@/config/cache-tags";
import { failure, Action, success } from "@/lib/action";
import { InternalServerError } from "@/errors";
import prisma from "@/lib/prisma";
import { unstable_cacheTag as cacheTag } from "next/cache";

type GetProductSpecificationsActionPayload = {
  productId: string;
  tenantId: string;
};

type GetProductSpecificationsActionResult = {
  specifications: {
    id: string;
    label: string;
    value: string;
  }[];
};

export const getProductSpecificationsAction: Action<
  GetProductSpecificationsActionPayload,
  GetProductSpecificationsActionResult
> = async ({ productId, tenantId }) => {
  "use cache";

  try {
    const specifications = await prisma.productSpecification.findMany({
      where: {
        productId,
      },
      select: {
        id: true,
        label: true,
        value: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    cacheTag(
      CACHE_TAGS.TENANT(tenantId).PRODUCTS.PRODUCT(productId).SPECIFICATIONS
    );

    return success({ specifications });
  } catch (error) {
    console.error(error);
    return failure(
      new InternalServerError("cannot get product specifications")
    );
  }
};
