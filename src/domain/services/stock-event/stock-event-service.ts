import { InvalidParamError } from "@/errors/domain/invalid-param.error";
import { PrismaTransaction } from "@/lib/prisma/types";
import { EitherResult, failure, success } from "@/utils/types/either";
import { EStockEventType } from "@prisma/client";

type DispatchOutputEventParams = {
  tenantId: string;
  stockId: string;
  stockLotId: string;
  quantity: number;
}

export type EmitOutputEventResult = EitherResult<
  null,
  InvalidParamError
>;

export class StockEventService {
  constructor(private readonly prisma: PrismaTransaction) {};

  public async emitOutput({
    tenantId,
    stockId,
    stockLotId,
    quantity,
  }: DispatchOutputEventParams): Promise<EmitOutputEventResult> {
    if (quantity <= 0) return failure(
      new InvalidParamError("Quantity must be greater than zero.")
    );

    await this.prisma.stockEvent.create({
      data: {
        type: EStockEventType.Output,
        tenantId,
        stockId,
        stockLotId,
        output: {
          create: {
            quantity: quantity,
            description: `Adeus, estoque! 🛒 Saíram ${quantity} unidades do lote. Venda feita, espaço liberado — bora repor?`,
          },
        },
      },
    });

    return success(null);
  }
}