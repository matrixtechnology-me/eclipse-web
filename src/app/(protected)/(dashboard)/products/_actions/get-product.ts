import { NotFoundError } from "@/errors/not-found";
import prisma from "@/lib/prisma";

type GetCustomersActionPayload = {
  id: string;
};

type GetCustomersActionResult = {
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    created_at: Date;
    updated_at: Date;
  };
};

export const getProduct = async ({ id }: GetCustomersActionPayload) => {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      variations: {
        include: {
          _count: {
            select: {
              specifications: true,
            },
          },
        },
      },
    },
  });

  if (!product) throw new NotFoundError("product not found");

  return {
    data: {
      product: {
        id: product.id,
        name: product.name,
        description: product.description ?? "",
        active: Boolean(product.active),
        variations: product.variations.map((variation) => ({
          id: variation.id,
          skuCode: variation.skuCode,
          salePrice: variation.salePrice.toNumber(),
          specificationsCount: variation._count.specifications,
          imageUrl: "",
        })),
      },
    },
  };
};
