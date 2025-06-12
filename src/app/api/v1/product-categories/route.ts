import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";
import { getRequestSession } from "../utils/get-request-session";

export const POST = async (request: NextRequest) => {
  const sessionResult = getRequestSession(request);

  if (sessionResult.session == null) {
    return Response.json(
      { message: sessionResult.errorMessage },
      { status: 401 },
    );
  }

  const { tenantId } = sessionResult.session;
  const searchParams = request.nextUrl.searchParams;

  const query = searchParams.get("query") ?? "";
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;

  const skip = (page - 1) * pageSize;

  const whereCondition: Prisma.ProductCategoryWhereInput = {
    tenantId: tenantId,
    OR: [
      { name: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ],
  };

  const [productCategories, totalCount] = await Promise.all([
    prisma.productCategory.findMany({
      where: whereCondition,
      skip,
      take: pageSize,
      orderBy: { name: "asc" },
    }),
    prisma.productCategory.count({ where: whereCondition }),
  ]);

  if (!productCategories.length) {
    return Response.json(
      { message: "No product categories found" },
      { status: 409 }
    );
  }

  return Response.json({
    productsCategories: productCategories.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description,
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
};
