import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";
import { getRequestSession } from "../../../../utils/get-request-session";

type Params = {
  params: Promise<{ id: string }>;
};

export const POST = async (request: NextRequest, { params }: Params) => {
  const sessionResult = getRequestSession(request);

  if (sessionResult.session == null) {
    return Response.json(
      { message: sessionResult.errorMessage },
      { status: 401 }
    );
  }

  const { tenantId } = sessionResult.session;
  const { id: categoryId } = await params;

  const searchParams = request.nextUrl.searchParams;

  const query = searchParams.get("query") ?? "";
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;

  const skip = (page - 1) * pageSize;

  const whereCondition: Prisma.ProductSubcategoryWhereInput = {
    tenantId,
    productCategorySubcategory: {
      some: {
        categoryId,
      },
    },
    OR: [
      { name: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ],
  };

  const [productSubcategories, totalCount] = await Promise.all([
    prisma.productSubcategory.findMany({
      where: whereCondition,
      skip,
      take: pageSize,
      orderBy: { name: "asc" },
    }),
    prisma.productSubcategory.count({ where: whereCondition }),
  ]);

  if (!productSubcategories.length) {
    return Response.json(
      { message: "No product subcategories found" },
      { status: 409 }
    );
  }

  return Response.json({
    productsCategories: productSubcategories.map((subcategory) => ({
      id: subcategory.id,
      name: subcategory.name,
      description: subcategory.description,
      createdAt: subcategory.createdAt,
      updatedAt: subcategory.updatedAt,
    })),
    pagination: {
      currentPage: page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    },
  });
};
