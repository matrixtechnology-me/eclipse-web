import { CACHE_TAGS } from "@/config/cache-tags";
import { failure, Action, success } from "@/lib/action";
import { InternalServerError } from "@/errors";
import prisma from "@/lib/prisma";
import { unstable_cacheTag as cacheTag } from "next/cache";

type GetProductCompositionsActionPayload = {
  productId: string;
  tenantId: string;
};

export type Composition = {
  id: string;
  totalQty: number;
  product: {
    id: string;
    name: string;
    internalCode: string;
    salePrice: number;
  };
  createdAt: Date;
  updatedAt: Date;
};

type GetProductCompositionsActionResult = {
  compositions: Composition[];
};

export const getProductCompositionsAction: Action<
  GetProductCompositionsActionPayload,
  GetProductCompositionsActionResult
> = async ({ productId, tenantId }) => {
  "use cache";
  cacheTag(
    CACHE_TAGS.TENANT(tenantId).PRODUCTS.PRODUCT(productId).COMPOSITIONS
  );

  try {
    const compositions = await prisma.productComposition.findMany({
      where: {
        parentId: productId,
      },
      select: {
        id: true,
        totalQty: true,
        child: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const mappedCompositions = compositions.map(
      (composition): Composition => ({
        id: composition.id,
        totalQty: composition.totalQty.toNumber(),
        product: {
          id: composition.child.id,
          internalCode: composition.child.internalCode,
          name: composition.child.name,
          salePrice: composition.child.salePrice.toNumber(),
        },
        createdAt: composition.createdAt,
        updatedAt: composition.updatedAt,
      })
    );

    return success({ compositions: mappedCompositions });
  } catch (error) {
    return failure(
      new InternalServerError("cannot get product compositions", {
        originalError: error,
      })
    );
  }
};
