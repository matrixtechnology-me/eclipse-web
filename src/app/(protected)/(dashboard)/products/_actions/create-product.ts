"use server";

import prisma from "@/lib/prisma";
import { failure, Action, success } from "@/lib/action";
import { BadRequestError, ConflictError, InternalServerError } from "@/errors";
import { EStockEventType, EStockStrategy } from "@prisma/client";
import { CurrencyFormatter } from "@/utils/formatters/currency";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/cache-tags";

type CreateProductActionPayload = {
  name: string;
  description: string;
  costPrice: number;
  salePrice: number;
  barCode: string;
  specifications: Array<{ label: string; value: string }>;
  tenantId: string;
  initialQuantity: number;
  expiresAt?: Date;
};

export const createProduct: Action<CreateProductActionPayload> = async ({
  name,
  description,
  tenantId,
  salePrice,
  specifications,
  barCode,
  initialQuantity,
  costPrice,
  expiresAt,
}) => {
  try {
    if (!name || !tenantId || salePrice <= 0) {
      throw new BadRequestError("Invalid input parameters");
    }

    const existingProduct = await prisma.product.findFirst({
      where: { OR: [{ name }, { barCode }], tenantId },
    });
    if (existingProduct) throw new ConflictError("Product already exists");

    const generatedLotNumber = generateLotNumber();

    await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name,
          description,
          tenantId,
          skuCode: generateSkuCode(),
          salePrice,
          barCode,
          internalCode: Math.floor(Math.random() * 0xffffff)
            .toString(16)
            .padStart(6, "0"),
          specifications: {
            createMany: {
              data: specifications,
            },
          },
        },
      });

      const stock = await tx.stock.create({
        data: {
          strategy: EStockStrategy.Fifo,
          availableQty: initialQuantity,
          totalQty: initialQuantity,
          tenantId,
          productId: product.id,
        },
      });

      if (initialQuantity > 0) {
        await tx.stockLot.create({
          data: {
            lotNumber: generatedLotNumber,
            costPrice,
            totalQty: initialQuantity,
            tenantId,
            expiresAt,
            stockId: stock.id,
          },
        });

        const stockEvent = await tx.stockEvent.create({
          data: {
            type: EStockEventType.Entry,
            stockId: stock.id,
            tenantId,
            description: `Lote ${generatedLotNumber} chegou! 🎉 São ${initialQuantity} unidades a caminho. Custo: ${CurrencyFormatter.format(
              costPrice
            )}. Vamos vender!`,
          },
        });

        await tx.stockEventEntry.create({
          data: {
            id: stockEvent.id,
            quantity: initialQuantity,
            description: `Lote ${generatedLotNumber.toUpperCase()} chegou! 🎉 São ${initialQuantity} unidades a caminho. Custo: ${CurrencyFormatter.format(
              costPrice
            )}. Vamos vender!`,
          },
        });
      }
    });

    revalidateTag(CACHE_TAGS.TENANT(tenantId).PRODUCTS.INDEX.GENERAL);
    revalidateTag(CACHE_TAGS.TENANT(tenantId).STOCKS.INDEX.GENERAL);

    return success(undefined);
  } catch (error: unknown) {
    console.error("Failed to create product:", error);
    return failure(new InternalServerError());
  }
};

function generateSkuCode(): string {
  return Math.floor(Math.random() * 0xffffffffffff)
    .toString(16)
    .padStart(12, "0");
}

function generateLotNumber(): string {
  return Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0");
}
