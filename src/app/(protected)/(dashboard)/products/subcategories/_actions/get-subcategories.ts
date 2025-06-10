"use server";

import { InternalServerError, NotFoundError } from "@/errors";
import prisma from "@/lib/prisma";
import { Action, success, failure } from "@/lib/action";
import { Prisma } from "@prisma/client";
import { unstable_cacheTag as cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/config/cache-tags";

export type SubcategoryListItem = {
  id: string;
  name: string;
  description: string;
  category: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
};

type PaginatedSubcategories = {
  subcategories: SubcategoryListItem[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
};

type GetSubcategoriesActionPayload = {
  tenantId: string;
  page: number;
  pageSize: number;
  query?: string;
};

export const getSubcategoriesAction: Action<
  GetSubcategoriesActionPayload,
  PaginatedSubcategories
> = async ({ tenantId, page, pageSize, query = "" }) => {
  "use cache";
  cacheTag(
    CACHE_TAGS.TENANT(tenantId).PRODUCTS.SUBCATEGORIES.INDEX.ALL,
    CACHE_TAGS.TENANT(tenantId).PRODUCTS.SUBCATEGORIES.INDEX.PAGINATED(
      page,
      pageSize
    )
  );

  try {
    const skip = (page - 1) * pageSize;

    const whereCondition: Prisma.ProductSubcategoryWhereInput = {
      tenantId,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    };

    const [subcategories, totalCount] = await Promise.all([
      prisma.productSubcategory.findMany({
        where: whereCondition,
        skip,
        take: pageSize,
        orderBy: { name: "asc" },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.productSubcategory.count({ where: whereCondition }),
    ]);

    const mappedSubcategories = subcategories.map((subcategory) => ({
      id: subcategory.id,
      name: subcategory.name,
      description: subcategory.description || "",
      category: {
        id: subcategory.category.id,
        name: subcategory.category.name,
      },
      createdAt: subcategory.createdAt,
      updatedAt: subcategory.updatedAt,
    }));

    return success({
      subcategories: mappedSubcategories,
      pagination: {
        currentPage: page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error: unknown) {
    console.error("failed to fetch subsubcategories:", error);
    return failure(
      new InternalServerError("Ocorreu um erro ao buscar as sub-categorias", {
        originalError: error instanceof Error ? error.message : String(error),
      })
    );
  }
};
