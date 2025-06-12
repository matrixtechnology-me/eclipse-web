"use server";

import { InternalServerError, NotFoundError } from "@/errors";
import prisma from "@/lib/prisma";
import { Action, success, failure } from "@/lib/action";
import { Prisma } from "@prisma/client";
import { unstable_cacheTag as cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/config/cache-tags";

export type CategoryListItem = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

type PaginatedCategories = {
  categories: CategoryListItem[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
};

type GetCategoriesActionPayload = {
  tenantId: string;
  page: number;
  pageSize: number;
  query?: string;
};

export const getCategoriesAction: Action<
  GetCategoriesActionPayload,
  PaginatedCategories
> = async ({ tenantId, page, pageSize, query = "" }) => {
  "use cache";
  cacheTag(
    CACHE_TAGS.TENANT(tenantId).PRODUCTS.CATEGORIES.INDEX.ALL,
    CACHE_TAGS.TENANT(tenantId).PRODUCTS.CATEGORIES.INDEX.PAGINATED(
      page,
      pageSize
    )
  );

  try {
    const skip = (page - 1) * pageSize;

    const whereCondition: Prisma.ProductCategoryWhereInput = {
      tenantId,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    };

    const [categories, totalCount] = await Promise.all([
      prisma.productCategory.findMany({
        where: whereCondition,
        skip,
        take: pageSize,
        orderBy: { name: "asc" },
      }),
      prisma.productCategory.count({ where: whereCondition }),
    ]);

    if (!categories.length) {
      return failure(new NotFoundError("No categories found"));
    }

    return success({
      categories: categories.map((category) => ({
        id: category.id,
        name: category.name,
        description: category.description || "",
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      })),
      pagination: {
        currentPage: page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error: unknown) {
    console.error("Failed to fetch categories:", error);
    return failure(
      new InternalServerError("Ocorreu um erro ao buscar as categorias", {
        originalError: error instanceof Error ? error.message : String(error),
      })
    );
  }
};
