"use server";

import prisma from "@/lib/prisma";
import { Action, success, failure } from "@/lib/action";
import {
  UnprocessableEntityError,
  InternalServerError,
  BadRequestError,
} from "@/errors";
import {
  EDiscountVariant,
  EExchangeMovementType,
  EPaymentMethod,
  EPosEventStatus,
  EPosEventType,
  ESaleMovementType,
  Sale,
  SaleProduct,
  StockLotUsage,
} from "@prisma/client";
import { PrismaTransaction } from "@/lib/prisma/types";
import { SalePricingCalculator } from "@/domain/services/sale/pricing-calculator";
import { createDinero } from "@/lib/dinero/factory";
import { StockService } from "@/domain/services/stock/stock-service";
import { StockEventService } from "@/domain/services/stock-event/stock-event-service";
import { InvalidEntityError } from "@/errors/domain/invalid-entity.error";
import { InvalidParamError } from "@/errors/domain/invalid-param.error";
import { InsufficientUnitsError } from "@/errors/domain/insufficient-units.error";

type ReturnedProduct = {
  productId: string;
  quantity: number;
  lotRestorations: Array<{
    stockLotUsageId: string;
    quantity: number;
  }>;
};

type ReplacementProduct = {
  productId: string;
  quantity: number;
};

type CreatePosExchangeActionPayload = {
  posId: string;
  tenantId: string;
  saleId: string;
  products: {
    returned: ReturnedProduct[];
    replacement: ReplacementProduct[];
  },
  discount?: {
    type: EDiscountVariant;
    amount: number;
  },
  movements: Array<{
    type: EExchangeMovementType,
    amount: number;
    method: EPaymentMethod;
  }>;
};

type CreatePosExchangeActionResult = {
  posEventExchangeId: string;
};

// todo: validate.
async function handleReturnedProducts(
  products: ReturnedProduct[],
  sale: Sale & {
    products: (SaleProduct & { stockLotUsages: StockLotUsage[] })[],
  },
  tx: PrismaTransaction,
  stockService: StockService,
) {
  for (const item of products) {
    if (item.quantity <= 0) throw new InvalidEntityError(
      `Invalid return quantity for Product ${item.productId}.`
    );

    const saleItem = sale.products.find(i => i.productId == item.productId);

    if (!saleItem) throw new InvalidEntityError(
      `Product ${item.productId} is not in the sale.`
    );

    // Restore returned units to Stock and StockLots.
    await stockService.restore(item.lotRestorations);

    // Update StockLotUsages.
    for (const lr of item.lotRestorations) {
      const lotUsage = await tx.stockLotUsage.findUnique({
        where: { id: lr.stockLotUsageId },
      });

      if (!lotUsage) throw new InvalidEntityError(
        `Lot Usage ${lr.stockLotUsageId} does not exist.`
      );

      if (lr.quantity <= 0 || lr.quantity > lotUsage.quantity)
        throw new InvalidEntityError(
          `Invalid quantity for Lot Usage ${lr.stockLotUsageId}.`
        );

      if (lr.quantity < lotUsage.quantity) {
        // Partially returned: LotUsage must be decremented.
        await tx.stockLotUsage.update({
          data: { quantity: { decrement: lr.quantity } },
          where: { id: lotUsage.id },
        });
      }

      if (lr.quantity == lotUsage.quantity) {
        // Fully returned: must be deleted from SaleProduct.
        await tx.stockLotUsage.delete({ where: { id: lotUsage.id } });
      }
    }

    const fullyReturned = item.quantity == saleItem.totalQty;

    if (fullyReturned) {
      // Remove from sale.
      sale.products = sale.products.filter(i => i.id != saleItem.id);

      await tx.saleProduct.delete({
        where: {
          id: saleItem.id,
          productId: item.productId,
          saleId: sale.id,
        },
      });
    } else {
      // Just decrement quantity.
      saleItem.totalQty -= item.quantity;
      saleItem.updatedAt = new Date();

      await tx.saleProduct.update({
        data: {
          totalQty: { decrement: item.quantity },
          updatedAt: new Date(),
        },
        where: {
          id: saleItem.id,
          productId: item.productId,
          saleId: sale.id,
        },
      });
    }
  }
}

// todo: validate.
async function handleReplacementProducts(
  products: ReplacementProduct[],
  sale: Sale & {
    products: (SaleProduct & { stockLotUsages: StockLotUsage[] })[],
  },
  tx: PrismaTransaction,
  stockService: StockService,
  tenantId: string,
) {
  for (const item of products) {
    if (item.quantity <= 0) throw new InvalidEntityError(
      `Invalid replacement quantity for Product ${item.productId}.`
    );

    const tenantProduct = await tx.product.findUnique({
      where: {
        id: item.productId,
        tenantId,
        deletedAt: null,
      },
    });

    if (!tenantProduct) throw new InvalidEntityError(
      `Product ${item.productId} does not exist.`
    );

    const result = await stockService.decrease({
      productId: item.productId,
      decreaseQty: item.quantity,
      tenantId,
    });

    if (result.isFailure) return result.error;
    const { decrements } = result.data;

    const saleItem = sale.products.find(i => i.productId == item.productId);
    const incremented = !!saleItem;

    if (incremented) {
      // Sale price must be updated.
      saleItem.salePrice = tenantProduct.salePrice;
      saleItem.totalQty += item.quantity;
      saleItem.updatedAt = new Date();

      await tx.saleProduct.update({
        data: {
          totalQty: { increment: item.quantity },
          salePrice: tenantProduct.salePrice,
          updatedAt: new Date(),
        },
        where: {
          id: saleItem.id,
          productId: item.productId,
          saleId: sale.id,
        },
      });

      await tx.stockLotUsage.createMany({
        data: decrements.map(dec => ({
          saleProductId: saleItem.id,
          quantity: dec.quantity,
          stockLotId: dec.stockLotId,
        }))
      });
    } else {
      // Normal pick-up.
      const createdItem = await tx.saleProduct.create({
        data: {
          name: tenantProduct.name,
          description: tenantProduct.description,
          salePrice: tenantProduct.salePrice,
          totalQty: item.quantity,
          productId: tenantProduct.id,
          saleId: sale.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        include: { stockLotUsages: true },
      });

      sale.products.push(createdItem);

      await tx.stockLotUsage.createMany({
        data: decrements.map(dec => ({
          saleProductId: createdItem.id,
          quantity: dec.quantity,
          stockLotId: dec.stockLotId,
        }))
      });
    }
  }
}

export const createPosExchangeAction: Action<
  CreatePosExchangeActionPayload,
  CreatePosExchangeActionResult
> = async ({
  posId,
  tenantId,
  saleId,
  products,
  movements,
  discount,
}) => {
    if (!posId) throw new BadRequestError("Pos ID is required");
    if (!tenantId) throw new BadRequestError("Tenant ID is required");
    if (!saleId) throw new BadRequestError("Sale ID is required");

    try {
      return await prisma.$transaction(async tx => {
        const sale = await tx.sale.findUnique({
          where: {
            id: saleId,
            tenantId,
            deletedAt: null,
          },
          include: {
            products: { include: { stockLotUsages: true } },
            movements: { include: { change: true, payment: true } },
          },
        });

        if (!sale) throw new InvalidEntityError("Sale does not exist");

        const stockService = new StockService(tx, new StockEventService(tx));

        await handleReturnedProducts(products.returned, sale, tx, stockService);

        await handleReplacementProducts(
          products.replacement,
          sale,
          tx,
          stockService,
          tenantId,
        );

        // Movements handling.
        for (const movement of movements) {
          if (movement.amount <= 0) throw new InvalidEntityError(
            `Movement amount must be greater than zero.`
          );

          const { type, ...baseData } = movement;

          const created = await tx.saleMovement.create({
            data: {
              type,
              saleId: sale.id,
              ...(movement.type == EExchangeMovementType.Change
                ? { change: { create: baseData } }
                : { payment: { create: baseData } }
              ),
            },
            include: { change: true, payment: true },
          });

          sale.movements.push(created);
        }

        const grossTotal = sale.products.reduce(
          (sum, { salePrice, totalQty }) => sum + salePrice.toNumber() * totalQty,
          0
        );

        const estimatedTotal = SalePricingCalculator.applyDiscount(
          createDinero(grossTotal), discount,
        );

        const paidTotal = sale.movements
          .filter((mv) => mv.type === ESaleMovementType.Payment)
          .reduce((sum, mv) => sum + mv.payment!.amount.toNumber(), 0);

        await tx.sale.update({
          data: {
            paidTotal,
            estimatedTotal: estimatedTotal.toUnit(),
            discountVariant: discount?.type,
            discountValue: discount?.amount,
            updatedAt: new Date(),
          },
          where: {
            id: sale.id,
            tenantId: tenantId,
          },
        });

        const posEvent = await tx.posEvent.create({
          data: {
            posId,
            type: EPosEventType.Exchange,
            status: EPosEventStatus.Processed,
          },
        });

        const posEventExchange = await tx.posEventExchange.create({
          data: {
            id: posEvent.id,
            movements: { createMany: { data: movements } },
            discountVariant: discount?.type,
            discountValue: discount?.amount,
            saleId: sale.id,
          },
        });

        for (const item of products.returned) {
          await tx.posEventExchangeReturn.create({
            data: {
              posEventExchangeId: posEventExchange.id,
              productId: item.productId,
              quantity: item.quantity,
              lotRestorations: {
                createMany: { data: item.lotRestorations },
              },
            },
          });
        }

        for (const item of products.replacement) {
          const tenantProduct = await tx.product.findUnique({
            where: {
              id: item.productId,
              tenantId,
              deletedAt: null,
            },
          });

          if (!tenantProduct) throw new InvalidEntityError(
            `Product ${item.productId} does not exist.`
          );

          await tx.posEventExchangeReplacement.create({
            data: {
              posEventExchangeId: posEventExchange.id,
              productId: item.productId,
              quantity: item.quantity,
              salePrice: tenantProduct.salePrice,
            },
          });
        }

        return success({ posEventExchangeId: posEventExchange.id });
      });
    } catch (error: unknown) {
      console.error("Failed to create pos exchange:", error);

      if (error instanceof Error) {
        const message = error.message;

        switch (error.constructor) {
          case InvalidParamError:
            return failure(new UnprocessableEntityError(message));
          case InvalidEntityError:
            return failure(new UnprocessableEntityError(message));
          case InsufficientUnitsError:
            return failure(new UnprocessableEntityError(message));
        }
      }

      return failure(
        new InternalServerError("Erro ao criar troca", {
          originalError: error instanceof Error ? error.message : String(error),
        })
      );
    }
  }