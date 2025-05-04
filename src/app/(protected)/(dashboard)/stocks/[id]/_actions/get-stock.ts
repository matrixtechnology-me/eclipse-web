"use server";

import { CACHE_TAGS } from "@/config/cache-tags";
import {
  createActionError,
  failure,
  ServerAction,
  success,
} from "@/core/server-actions";
import prisma from "@/lib/prisma";
import { EStockStrategy } from "@prisma/client";
import { unstable_cacheTag as cacheTag } from "next/cache";

type GetStockActionPayload = {
  tenantId: string;
  stockId: string;
};

type GetStockActionResult = {
  stock: {
    id: string;
    strategy: EStockStrategy;
    availableQty: number;
    totalQty: number;
    product: {
      id: string;
      name: string;
    };
    lots: {
      id: string;
      totalQty: number;
      costPrice: number;
      lotNumber: string;
      expiresAt?: Date;
      createdAt: Date;
      updatedAt: Date;
    }[];
  };
};

export const getStockAction: ServerAction<
  GetStockActionPayload,
  GetStockActionResult
> = async ({ tenantId, stockId }) => {
  "use cache";

  cacheTag(
    CACHE_TAGS.TENANT(tenantId).STOCKS.STOCK(stockId).EVENTS,
    CACHE_TAGS.TENANT(tenantId).STOCKS.STOCK(stockId).LOTS
  );

  try {
    const stock = await prisma.stock.findFirst({
      where: {
        tenantId,
        id: stockId,
      },
      select: {
        id: true,
        strategy: true,
        availableQty: true,
        totalQty: true,
        product: {
          select: {
            id: true,
            name: true,
          },
        },
        lots: {
          select: {
            id: true,
            totalQty: true,
            costPrice: true,
            lotNumber: true,
            expiresAt: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!stock) {
      return failure(
        createActionError(404, "StockNotFound", "Estoque não encontrado")
      );
    }

    const mappedLots = stock.lots.map((lot) => ({
      ...lot,
      costPrice: lot.costPrice.toNumber(),
      expiresAt: lot.expiresAt ?? undefined,
    }));

    return success({
      stock: {
        ...stock,
        lots: mappedLots,
      },
    });
  } catch (error) {
    console.error(error);
    return failure(
      createActionError(500, "FetchError", "Erro ao buscar o estoque", {
        originalError: error instanceof Error ? error.message : String(error),
      })
    );
  }
};
