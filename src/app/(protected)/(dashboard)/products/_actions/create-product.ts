"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/session";
import { ServerAction } from "@/types/server-actions";
import { propagateError } from "@/utils/propagate-error";

type CreateProductActionPayload = {
  name: string;
  description: string;
  costPrice: number;
  salePrice: number;
  quantity: number;
};

type CreateProductActionResult = {};

export const createProduct: ServerAction<
  CreateProductActionPayload,
  CreateProductActionResult
> = async ({ costPrice, description, name, salePrice, quantity }) => {
  try {
    const session = await getServerSession();

    if (!session) throw new Error("session not found");

    await prisma.product.create({
      data: {
        costPrice,
        name,
        salePrice,
        description,
        quantity,
        tenantId: session.tenantId,
      },
    });

    return { data: {} };
  } catch (error) {
    return propagateError(error as Error);
  }
};
