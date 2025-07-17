import prisma from "@/lib/prisma";
import { EStockEventType } from "@prisma/client";

type DispatchOutputEventParams = {
  tenantId: string;
  stockId: string;
  stockLotId: string;
  quantity: number;
}

export class StockEventService {
  public static async emitOutput({
    tenantId,
    stockId,
    stockLotId,
    quantity,
  }: DispatchOutputEventParams) {
    // TODO: quantity validation: Int > 0.

    await prisma.stockEvent.create({
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
  }
}