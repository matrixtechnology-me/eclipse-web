import { EitherResult, failure, success } from "@/utils/types/either";
import { PrismaTransaction } from "@/lib/prisma/types";
import { Prisma } from "@prisma/client";
import { StockService } from "../stock/stock-service";
import { InvalidEntityError } from "@/errors/domain/invalid-entity.error";

export type ProductListItem = {
  id: string;
  name: string;
  description: string;
  barCode: string;
  internalCode: string;
  active: boolean;
  salePrice: number;
  availableQty: number | undefined;
  createdAt: Date;
  updatedAt: Date;
};

export type GetProductsResult = EitherResult<
  {
    results: ProductListItem[];
    pagination: {
      limit: number;
      currentPage: number;
      totalItems: number;
      totalPages: number;
    };
  },
  InvalidEntityError
>;

type GetProductsParams = {
  pagination: {
    page: number;
    limit: number;
  };
  filters: {
    active: boolean;
    tenantId: string;
    searchValue?: string;
    excludeIds?: string[];
  };
  populate?: {
    availableQty?: boolean;
  };
}

export class ProductService {
  constructor(
    private readonly prisma: PrismaTransaction,
    private readonly stockService: StockService,
  ) {};

  // TODO: unit tests.
  public async getProducts({
    filters,
    pagination,
    populate,
  }: GetProductsParams): Promise<GetProductsResult> {
    const { active, tenantId, excludeIds, searchValue } = filters;

    const whereClause: Prisma.ProductWhereInput = {
      id: { notIn: excludeIds },
      tenantId,
      active,
      deletedAt: null,
      OR: [
        { name: { contains: searchValue, mode: "insensitive" } },
        { barCode: { contains: searchValue, mode: "insensitive" } },
        { internalCode: { contains: searchValue, mode: "insensitive" } },
        { description: { contains: searchValue, mode: "insensitive" } },
        { skuCode: { contains: searchValue, mode: "insensitive" } },
      ],
    };

    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [rawProducts, totalItems] = await Promise.all([
      this.prisma.product.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { name: "asc" },
      }),
      this.prisma.product.count({ where: whereClause }),
    ]);

    const results: ProductListItem[] = [];

    for (const raw of rawProducts) {
      const mappedProduct: ProductListItem = {
        id: raw.id,
        name: raw.name,
        description: raw.description,
        barCode: raw.barCode,
        internalCode: raw.internalCode,
        active: raw.active,
        salePrice: raw.salePrice.toNumber(),
        availableQty: undefined,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      }

      if (populate?.availableQty) {
        const qtyResult = await this.stockService.getAvailableQty(raw.id);
        if (qtyResult.isFailure) return failure(qtyResult.error);

        mappedProduct.availableQty = qtyResult.data;
      }

      results.push(mappedProduct);
    }

    return success({
      results,
      pagination: {
        limit,
        currentPage: page,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    });
  }
}
