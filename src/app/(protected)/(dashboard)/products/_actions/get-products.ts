"use server";

import { InternalServerError, UnprocessableEntityError } from "@/errors";
import prisma from "@/lib/prisma";
import { Action, success, failure } from "@/lib/action";
import { unstable_cacheTag as cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/config/cache-tags";
import {
  ProductListItem,
  ProductService,
} from "@/domain/services/product/product-service";
import { StockService } from "@/domain/services/stock/stock-service";
import { StockEventService } from "@/domain/services/stock-event/stock-event-service";
import { InvalidEntityError } from "@/errors/domain/invalid-entity.error";

type PaginatedProducts = {
  products: ProductListItem[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
};

type GetProductsActionPayload = {
  page: number;
  limit: number;
  active: boolean;
  tenantId: string;
  salable: boolean | undefined;
  query?: string;
  excludeIds?: string[];
  includeAvailableQty?: boolean;
  includeFlatComposition?: boolean;
};

export const getProductsAction: Action<
  GetProductsActionPayload,
  PaginatedProducts
> = async ({
  tenantId,
  page,
  limit,
  query,
  active,
  salable,
  excludeIds,
  includeAvailableQty,
  includeFlatComposition,
}) => {
    "use cache";
    cacheTag(
      CACHE_TAGS.TENANT(tenantId).PRODUCTS.INDEX.ALL,
      CACHE_TAGS.TENANT(tenantId).PRODUCTS.INDEX.PAGINATED(page, limit)
    );

    try {
      const result = await prisma.$transaction(async (tx) => {
        const stockEventService = new StockEventService(tx);
        const stockService = new StockService(tx, stockEventService);
        const productService = new ProductService(tx, stockService);

        return await productService.getProducts({
          pagination: {
            page,
            limit,
          },
          filters: {
            searchValue: query,
            salable,
            active,
            tenantId,
            excludeIds,
          },
          populate: {
            availableQty: includeAvailableQty,
            flatComposition: includeFlatComposition,
          },
        });
      });

      if (result.isFailure) throw result.error;
      const { results, pagination } = result.data;

      return success({
        products: results,
        pagination: {
          currentPage: pagination.currentPage,
          pageSize: pagination.limit,
          totalCount: pagination.totalItems,
          totalPages: pagination.totalPages,
        }
      });
    } catch (error: unknown) {
      console.error("Failed to fetch products:", error);

      if (error instanceof Error) {
        const message = error.message;

        switch (error.constructor) {
          case InvalidEntityError:
            return failure(new UnprocessableEntityError(message));
        }
      }

      return failure(
        new InternalServerError("Ocorreu um erro durante a busca", {
          originalError: error instanceof Error ? error.message : String(error),
        })
      );
    }
  };
