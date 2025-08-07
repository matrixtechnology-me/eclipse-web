import { InsufficientUnitsError } from "@/errors/domain/insufficient-units.error";
import { InvalidEntityError } from "@/errors/domain/invalid-entity.error";
import { InvalidParamError } from "@/errors/domain/invalid-param.error";
import { StockEventService } from "../stock-event/stock-event-service";
import { EitherResult, failure, success } from "@/utils/types/either";
import { PrismaTransaction } from "@/lib/prisma/types";
import { UnprocessableEntityError } from "@/errors";

export type StockLotDecrement = {
  stockId: string;
  stockLotId: string;
  quantity: number;
  costPrice: number;
}

export type DecreaseParams = {
  productId: string;
  tenantId: string;
  decreaseQty: number;
}

export type DecreaseResult = EitherResult<
  { decrements: StockLotDecrement[] },
  InvalidParamError | InsufficientUnitsError | UnprocessableEntityError
>;

export type GetAvailableQtyResult = EitherResult<
  number,
  InvalidEntityError
>;

export type GetFlatCompositionsResult = EitherResult<
  Array<{
    productId: string;
    usedQuantity: number;
  }>,
  Error
>;

export class StockService {
  constructor(
    private readonly prisma: PrismaTransaction,
    private readonly stockEventService: StockEventService,
  ) {};

  // TODO: unit tests.
  public async getFlatCompositions(productId: string): Promise<GetFlatCompositionsResult> {
    type RESULT_SET = [{
      to_jsonb: Array<{
        product_id: string;
        used_qty: number;
      }>;
    }];

    // DB get_available_qty function is defined on 
    // migration "20250805114743_feat".
    const resultSet = await this.prisma.$queryRaw<RESULT_SET>`
      SELECT to_jsonb(flat_compositions)
      FROM get_flat_composition(${productId}::uuid)
      AS flat_compositions;
    `;

    const flatCompositions = resultSet[0].to_jsonb.map(comp => ({
      productId: comp.product_id,
      usedQuantity: comp.used_qty,
    }));

    return success(flatCompositions);
  }

  // TODO: unit tests.
  // TODO: raise exception on its database function.
  public async getAvailableQty(productId: string): Promise<GetAvailableQtyResult> {
    // DB get_available_qty function is defined on 
    // migration "20250723125301_feat".
    const resultSet = await this.prisma.$queryRaw<{ available_qty: number }[]>`
      SELECT get_available_qty(${productId}::uuid) AS available_qty
    `;

    return success(resultSet[0]?.available_qty || 0);
  }

  // TODO: unit tests.
  public async decrease({
    productId,
    decreaseQty,
    tenantId,
  }: DecreaseParams): Promise<DecreaseResult> {
    try {
      if (decreaseQty <= 0) return failure(
        new InvalidParamError('Decrease quantity must be greater than 0.')
      );

      type RESULT_SET = [{
        to_jsonb: Array<{
          lot_id: string;
          qty: number;
          cost_price: number;
        }>;
      }];

      // DB get_available_qty function is defined on 
      // migration "20250729135608_feat".
      const resultSet = await this.prisma.$queryRaw<RESULT_SET>`
        SELECT to_jsonb(lot_decrements)
        FROM decrease_stock(${productId}::uuid, ${decreaseQty}::integer)
        AS lot_decrements;
      `;

      const lotDecrements = resultSet[0].to_jsonb;
      const mappedDecrements: StockLotDecrement[] = [];

      // Emit stock output events.
      for (const dec of lotDecrements) {
        const lot = await this.prisma.stockLot.findUnique({
          where: {
            id: dec.lot_id,
            stock: { tenantId },
          },
        });

        if (lot == null) return failure(new UnprocessableEntityError(
          `Product '${productId}' reach invalid or nonexistent lot.`
        ));

        const result = await this.stockEventService.emitOutput({
          stockId: lot.stockId,
          tenantId: tenantId,
          stockLotId: dec.lot_id,
          quantity: dec.qty,
        });

        if (result.isFailure) return failure(result.error);

        mappedDecrements.push({
          stockLotId: dec.lot_id,
          quantity: dec.qty,
          costPrice: dec.cost_price,
          stockId: lot.stockId,
        });
      }

      return success({ decrements: mappedDecrements });
    }
    catch (err) {
      console.error(
        `StockService.decrease unexpected error: ${JSON.stringify(err)}`
      );

      if (err instanceof Error) {
        if (err.message.includes('has no Childs'))
          return failure(new UnprocessableEntityError(err.message));

        if (err.message.includes('Not enough units on Stock'))
          return failure(new InsufficientUnitsError(err.message));

        return failure(err);
      }

      return failure(new Error(JSON.stringify(err)));
    }
  }
}