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

  const whereCondition: Prisma.ProductWhereInput = {
    tenantId: tenantId,
    active: true,
    deletedAt: null,
    OR: [
      { name: { contains: query, mode: "insensitive" } },
      { barCode: { contains: query, mode: "insensitive" } },
      { internalCode: { contains: query, mode: "insensitive" } },
    ],
  };

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where: whereCondition,
      skip,
      take: pageSize,
      orderBy: { name: "asc" },
    }),
    prisma.product.count({ where: whereCondition }),
  ]);

  if (!products.length) {
    return Response.json(
      { message: "No active products found" },
      { status: 409 }
    );
  }

  return Response.json({
    products: products.map((product) => ({
      id: product.id,
      name: product.name,
      barCode: product.barCode,
      internalCode: product.internalCode,
      active: product.active,
      salePrice: product.salePrice.toNumber(),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    })),
    pagination: {
      currentPage: page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    },
  });
};
