"use server";

import { failure, ServerAction, success } from "@/core/server-actions";
import { InternalServerError } from "@/errors";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type GetPosActionPayload = {
  tenantId: string;
  page: number;
  pageSize: number;
  query: string;
};

type GetPosActionResult = {
  pos: {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
};

export const getPosAction: ServerAction<
  GetPosActionPayload,
  GetPosActionResult
> = async ({ tenantId, page, pageSize, query }) => {
  try {
    const skip = (page - 1) * pageSize;

    const whereCondition: Prisma.PosWhereInput = {
      tenantId,
      OR: [
        {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    };

    const [pos, totalCount] = await Promise.all([
      prisma.pos.findMany({
        where: whereCondition,
        skip,
        take: pageSize,
        orderBy: { name: "asc" },
      }),
      prisma.pos.count({ where: whereCondition }),
    ]);

    return success({
      pos,
      pagination: {
        currentPage: page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error) {
    console.error(error);
    return failure(
      new InternalServerError("Ocorreu um erro ao buscar os pontos de venda", {
        originalError: error instanceof Error ? error.message : String(error),
      })
    );
  }
};
