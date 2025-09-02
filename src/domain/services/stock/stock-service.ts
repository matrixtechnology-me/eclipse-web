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

export type RestoreParams = {
  lotRestorations: Array<{
    stockLotUsageId: string;
    quantity: number;
  }>;
  // tenantId: string;
}

export type DecreaseResult = EitherResult<
  { decrements: StockLotDecrement[] },
  InvalidParamError | InsufficientUnitsError | UnprocessableEntityError
>;

export type RestoreResult = EitherResult<
  void,
  InvalidParamError | InsufficientUnitsError | UnprocessableEntityError
>;

export type GetAvailableQtyResult = EitherResult<
  number,
  InvalidEntityError
>;

export type FlatCompositionItem = {
  productId: string;
  usedQuantity: number;
  availableQty: number;
}

export type GetFlatCompositionsResult = EitherResult<
  FlatCompositionItem[],
  InvalidEntityError
>;

export class StockService {
  constructor(
    private readonly prisma: PrismaTransaction,
    private readonly stockEventService: StockEventService,
  ) {};

  // todo: tests with postgres instance.
  public async getFlatCompositions(productId: string): Promise<GetFlatCompositionsResult> {
    type RESULT_SET = [{
      to_jsonb: Array<{
        product_id: string;
        used_qty: number;
      }>;
    }];

    // DB get_flat_composition function is defined on 
    // migration "20250805114743_feat".
    const resultSet = await this.prisma.$queryRaw<RESULT_SET>`
      SELECT to_jsonb(flat_compositions)
      FROM get_flat_composition(${productId}::uuid)
      AS flat_compositions;
    `;

    // Assure sum of used quantities in case of same product compositing
    // different compositions.
    const map = new Map<string, FlatCompositionItem>();

    for (const item of resultSet[0].to_jsonb) {
      const existing = map.get(item.product_id);

      if (existing) {
        map.set(item.product_id, {
          ...existing,
          usedQuantity: existing.usedQuantity + item.used_qty,
        });

        continue;
      }

      const result = await this.getAvailableQty(item.product_id);
      if (result.isFailure) throw result.error;

      map.set(item.product_id, {
        productId: item.product_id,
        usedQuantity: item.used_qty,
        availableQty: result.data,
      });
    }

    return success(Array.from(map.values()));
  }

  // todo: tests with postgres instance.
  // todo: raise exception on its database function.
  public async getAvailableQty(productId: string): Promise<GetAvailableQtyResult> {
    // DB get_available_qty function is defined on 
    // migration "20250723125301_feat".
    const resultSet = await this.prisma.$queryRaw<{ available_qty: number }[]>`
      SELECT get_available_qty(${productId}::uuid) AS available_qty
    `;

    return success(resultSet[0]?.available_qty || 0);
  }

  // todo: tests with postgres instance.
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

  // todo: tests with postgres instance.
  // todo: manual tests.
  public async restore(lotRestorations: Array<{
    stockLotUsageId: string;
    quantity: number;
  }>) {
    try {
      for (const restoration of lotRestorations) {
        const lotUsage = await this.prisma.stockLotUsage.findUnique({
          where: { id: restoration.stockLotUsageId },
          include: { stockLot: true },
        });

        if (!lotUsage) throw new InvalidEntityError(
          `Lot Usage ${restoration.stockLotUsageId} does not exist.`
        );

        const stockLot = lotUsage.stockLot;

        // Increment related Stock Lot.
        await this.prisma.stockLot.update({
          data: {
            totalQty: { increment: restoration.quantity },
            updatedAt: new Date(),
          },
          where: { id: stockLot.id },
        });

        // Increment related Stock.
        await this.prisma.stock.update({
          data: {
            availableQty: { increment: restoration.quantity },
            totalQty: { increment: restoration.quantity },
            updatedAt: new Date(),
          },
          where: { id: stockLot.stockId },
        });
      }
    } catch (err) {
      console.error(`StockService.restore error: ${JSON.stringify(err)}`);

      return failure(
        err instanceof Error ? err : new Error(JSON.stringify(err))
      );
    }
  }
}