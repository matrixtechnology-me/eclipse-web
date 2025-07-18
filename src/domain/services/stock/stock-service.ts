import { InsufficientUnitsError } from "@/errors/domain/insufficient-units.error";
import { InvalidEntityError } from "@/errors/domain/invalid-entity.error";
import { InvalidParamError } from "@/errors/domain/invalid-param.error";
import { EStockStrategy } from "@prisma/client";
import { StockEventService } from "../stock-event/stock-event-service";
import { EitherResult, failure, success } from "@/utils/types/either";
import { PrismaTransaction } from "@/lib/prisma/types";

export type StockLotDecrement = {
  stockLotId: string;
  quantity: number;
  costPrice: number;
}

export type DecreaseResult = EitherResult<
  { stockId: string, decrements: StockLotDecrement[] },
  InvalidParamError | InvalidEntityError | InsufficientUnitsError
>;

export class StockService {
  constructor(
    private readonly prisma: PrismaTransaction,
    private readonly stockEventService: StockEventService,
  ) {};

  public async decrease(
    productId: string, decreaseQuantity: number
  ): Promise<DecreaseResult> {
    try {
      if (decreaseQuantity <= 0) return failure(
        new InvalidParamError('Decrease quantity must be greater than 0.')
      );

      const stock = await this.prisma.stock.findUnique({
        where: { productId },
      });

      if (!stock) return failure(
        new InvalidEntityError(`There is no Stock for Product '${productId}'.`)
      );

      if (stock.availableQty < decreaseQuantity) return failure(
        new InsufficientUnitsError(stock.id)
      );

      const orderDirection =
        stock.strategy === EStockStrategy.Fifo ? "asc" : "desc";

      // New query instead of 'populating' to simplify ordering.
      // However this approach lowers performance.
      const stockLots = await this.prisma.stockLot.findMany({
        where: {
          stockId: stock.id,
          totalQty: { gt: 0 },
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } },
          ],
        },
        orderBy: [
          { expiresAt: orderDirection },
          { createdAt: orderDirection },
        ],
      });

      const decrements: StockLotDecrement[] = [];
      let takenUnits = 0;

      for (const lot of stockLots) {
        if (takenUnits == decreaseQuantity) break;

        const pendingUnits = decreaseQuantity - takenUnits;

        if (pendingUnits >= lot.totalQty) {
          decrements.push({
            stockLotId: lot.id,
            quantity: lot.totalQty,
            costPrice: lot.costPrice.toNumber(),
          });

          takenUnits += lot.totalQty;
          continue;
        }

        decrements.push({
          stockLotId: lot.id,
          quantity: pendingUnits,
          costPrice: lot.costPrice.toNumber(),
        });

        takenUnits += pendingUnits;
      }

      // Only happens if Stock available quantity is inconsistent with lots.
      if (takenUnits != decreaseQuantity) return failure(
        new InsufficientUnitsError("Inconsistent units between stock and lots.")
      );

      const [, , outputEventsResults] = await Promise.all([
        // Stock quantity.
        await this.prisma.stock.update({
          where: { id: stock.id },
          data: {
            availableQty: { decrement: decreaseQuantity },
            totalQty: { decrement: decreaseQuantity },
          },
        }),
        // Stock Lots quantity.
        await Promise.all(decrements.map(async (dec) => (
          await this.prisma.stockLot.update({
            where: { id: dec.stockLotId },
            data: { totalQty: { decrement: dec.quantity } },
          })
        ))),
        // Output events.
        await Promise.all(decrements.map(async (dec) => (
          await this.stockEventService.emitOutput({
            tenantId: stock.tenantId,
            stockId: stock.id,
            stockLotId: dec.stockLotId,
            quantity: dec.quantity,
          })
        ))),
      ]);

      for (const result of outputEventsResults)
        if (result.isFailure) return failure(result.error);

      return success({ stockId: stock.id, decrements });
    }
    catch (error) {
      console.error(
        `StockService.decrease unexpected error: ${JSON.stringify(error)}`
      );

      return failure(error instanceof Error
        ? error
        : new Error(JSON.stringify(error))
      );
    }
  }
}