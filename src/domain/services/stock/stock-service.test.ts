import { expect, it, vi, describe, afterEach } from 'vitest';
import type { Mock as VitestMock } from 'vitest';
import { StockService } from '@/domain/services/stock/stock-service';
import mockedPrisma from '@/lib/__mocks__/prisma';
import { failure, success } from '@/utils/types/either';
import { InvalidEntityError } from '@/errors/domain/invalid-entity.error';
import { InvalidParamError } from '@/errors/domain/invalid-param.error';
import { InsufficientUnitsError } from '@/errors/domain/insufficient-units.error';
import { Decimal } from '@prisma/client/runtime/library';
import { StockEventService } from '../stock-event/stock-event-service';
import { beforeEach } from 'node:test';

const [stockId, productId, tenantId] = Object.freeze(["ID", "P_ID", "T_ID"]);

let lots = Object.freeze([
  {
    id: "Lot1", // older
    lotNumber: "1",
    stockId,
    tenantId,
    totalQty: 10,
    costPrice: Decimal(100),
    updatedAt: new Date("2025-01-01T10:30:00Z"),
    createdAt: new Date("2025-01-01T10:30:00Z"),
    expiresAt: new Date("2025-10-01T10:30:00Z"),
  },
  {
    id: "Lot2",
    lotNumber: "2",
    stockId,
    tenantId,
    totalQty: 10,
    costPrice: Decimal(110),
    updatedAt: new Date("2025-04-01T10:30:00Z"),
    createdAt: new Date("2025-04-01T10:30:00Z"),
    expiresAt: new Date("2025-12-01T10:30:00Z"),
  },
  {
    id: "Lot3",
    lotNumber: "3",
    stockId,
    tenantId,
    totalQty: 10,
    costPrice: Decimal(120),
    updatedAt: new Date("2025-06-01T10:30:00Z"),
    createdAt: new Date("2025-06-01T10:30:00Z"),
    expiresAt: new Date("2026-02-01T10:30:00Z"),
  },
  {
    id: "Lot4",
    lotNumber: "4",
    stockId,
    tenantId,
    totalQty: 9,
    costPrice: Decimal(130),
    updatedAt: new Date("2025-08-01T10:30:00Z"),
    createdAt: new Date("2025-08-01T10:30:00Z"),
    expiresAt: new Date("2026-04-01T10:30:00Z"),
  },
  {
    id: "Lot5", // newer
    lotNumber: "5",
    stockId,
    tenantId,
    totalQty: 40,
    costPrice: Decimal(140),
    updatedAt: new Date("2025-10-01T10:30:00Z"),
    createdAt: new Date("2025-10-01T10:30:00Z"),
    expiresAt: new Date("2026-06-01T10:30:00Z"),
  }
]);

const [lot1, lot2, lot3, lot4, lot5] = lots;

vi.mock("@/lib/prisma"); // looks for "@/lib/__mocks__/prisma"

vi.mock("../stock-event/stock-event-service", () => ({
  StockEventService: {
    emitOutput: vi.fn().mockResolvedValue(undefined),
  },
}));

beforeEach(() => {
  // Mock stock update mutation.
  (mockedPrisma.stock.update as VitestMock).mockResolvedValue(undefined);

  // Mock stock lot update mutation.
  (mockedPrisma.stockLot.update as VitestMock).mockResolvedValue(undefined);

  lots = Object.freeze([
    {
      id: "Lot1", // older
      lotNumber: "1",
      stockId,
      tenantId,
      totalQty: 10,
      costPrice: Decimal(100),
      updatedAt: new Date("2025-01-01T10:30:00Z"),
      createdAt: new Date("2025-01-01T10:30:00Z"),
      expiresAt: new Date("2025-10-01T10:30:00Z"),
    },
    {
      id: "Lot2",
      lotNumber: "2",
      stockId,
      tenantId,
      totalQty: 10,
      costPrice: Decimal(110),
      updatedAt: new Date("2025-04-01T10:30:00Z"),
      createdAt: new Date("2025-04-01T10:30:00Z"),
      expiresAt: new Date("2025-12-01T10:30:00Z"),
    },
    {
      id: "Lot3",
      lotNumber: "3",
      stockId,
      tenantId,
      totalQty: 10,
      costPrice: Decimal(120),
      updatedAt: new Date("2025-06-01T10:30:00Z"),
      createdAt: new Date("2025-06-01T10:30:00Z"),
      expiresAt: new Date("2026-02-01T10:30:00Z"),
    },
    {
      id: "Lot4",
      lotNumber: "4",
      stockId,
      tenantId,
      totalQty: 9,
      costPrice: Decimal(130),
      updatedAt: new Date("2025-08-01T10:30:00Z"),
      createdAt: new Date("2025-08-01T10:30:00Z"),
      expiresAt: new Date("2026-04-01T10:30:00Z"),
    },
    {
      id: "Lot5", // newer
      lotNumber: "5",
      stockId,
      tenantId,
      totalQty: 40,
      costPrice: Decimal(140),
      updatedAt: new Date("2025-10-01T10:30:00Z"),
      createdAt: new Date("2025-10-01T10:30:00Z"),
      expiresAt: new Date("2026-06-01T10:30:00Z"),
    }
  ]);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("StockService.decrease", async () => {
  it("should not accept decrease quantity lower or equals than zero", () => {
    const expected = failure(
      new InvalidParamError('Decrease quantity must be greater than 0.')
    );

    expect(StockService.decrease(productId, 0))
      .resolves.toStrictEqual(expected);

    expect(StockService.decrease(productId, -15))
      .resolves.toStrictEqual(expected);

    expect(StockService.decrease(productId, -43.873))
      .resolves.toStrictEqual(expected);
  });

  it("should throw an error on invalid product id", async () => {
    const expected = failure(
      new InvalidEntityError(`There is no Stock for Product '${productId}'.`)
    );

    mockedPrisma.stock.findUnique.mockResolvedValueOnce(null);

    expect(StockService.decrease(productId, 20))
      .resolves.toStrictEqual(expected);

    expect(mockedPrisma.stock.findUnique)
      .toHaveBeenCalledWith({ where: { productId } });
  });

  it("should throw an error on insufficient stock units", () => {
    const stockMock = {
      id: stockId,
      productId,
      availableQty: 20,
      totalQty: 20,
      strategy: "Fifo" as const,
      tenantId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const expected = failure(new InsufficientUnitsError(stockId));

    mockedPrisma.stock.findUnique.mockResolvedValue(stockMock);

    expect(StockService.decrease(productId, 21))
      .resolves.toStrictEqual(expected);

    mockedPrisma.stock.findUnique.mockResolvedValue(stockMock);

    expect(StockService.decrease(productId, 280.33))
      .resolves.toStrictEqual(expected);
  });

  it("should throw an error on inconsistent units between stock and its lots",
    () => {
      const expected = failure(
        new InsufficientUnitsError("Inconsistent units between stock and lots.")
      );

      mockedPrisma.stock.findUnique.mockResolvedValueOnce({
        id: stockId,
        productId,
        availableQty: 20,
        totalQty: 20,
        strategy: "Fifo",
        tenantId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockedPrisma.stockLot.findMany.mockResolvedValueOnce([
        lot2, lot4, // 19 units
      ]);

      expect(StockService.decrease(productId, 20))
        .resolves.toStrictEqual(expected);

      mockedPrisma.stock.findUnique.mockResolvedValueOnce({
        id: stockId,
        productId,
        availableQty: 60,
        totalQty: 60,
        strategy: "Fifo",
        tenantId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockedPrisma.stockLot.findMany.mockResolvedValueOnce([
        lot4, lot5, // 49 units
      ]);

      expect(StockService.decrease(productId, 50))
        .resolves.toStrictEqual(expected);
    }
  );

  describe(
    "should properly select lot decrements based on stock strategy",
    () => {
      it("fifo strategy", async () => {
        mockedPrisma.stock.findUnique.mockResolvedValueOnce({
          id: stockId,
          productId,
          availableQty: 30,
          totalQty: 30,
          strategy: "Fifo",
          tenantId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        mockedPrisma.stockLot.findMany.mockResolvedValueOnce([
          lot1, lot2, lot3,
        ]);

        const expected = success({
          stockId,
          decrements: [
            {
              stockLotId: "Lot1",
              quantity: 10,
              costPrice: 100,
            },
            {
              stockLotId: "Lot2",
              quantity: 5,
              costPrice: 110,
            },
          ],
        });

        expect(await StockService.decrease(productId, 15))
          .toStrictEqual(expected);

        expect(mockedPrisma.stockLot.findMany)
          .toHaveBeenCalledWith({
            where: {
              stockId,
              totalQty: { gt: 0 },
              OR: [
                { expiresAt: null },
                { expiresAt: { gt: expect.any(Date) } },
              ],
            },
            orderBy: {
              expiresAt: "asc",
              createdAt: "asc",
            },
          });
      });

      it("lifo strategy", async () => {
        mockedPrisma.stock.findUnique.mockResolvedValueOnce({
          id: stockId,
          productId,
          availableQty: 30,
          totalQty: 30,
          strategy: "Lifo",
          tenantId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        mockedPrisma.stockLot.findMany.mockResolvedValueOnce([
          lot3, lot2, lot1,
        ]);

        const expected = success({
          stockId,
          decrements: [
            {
              stockLotId: "Lot3",
              quantity: 10,
              costPrice: 120,
            },
            {
              stockLotId: "Lot2",
              quantity: 5,
              costPrice: 110,
            },
          ],
        });

        expect(await StockService.decrease(productId, 15))
          .toStrictEqual(expected);

        expect(mockedPrisma.stockLot.findMany)
          .toHaveBeenCalledWith({
            where: {
              stockId,
              totalQty: { gt: 0 },
              OR: [
                { expiresAt: null },
                { expiresAt: { gt: expect.any(Date) } },
              ],
            },
            orderBy: {
              expiresAt: "desc",
              createdAt: "desc",
            },
          });
      });
    }
  );

  it("should decrement stock and lot quantities on success", async () => {
    mockedPrisma.stock.findUnique.mockResolvedValueOnce({
      id: stockId,
      productId,
      availableQty: 30,
      totalQty: 30,
      strategy: "Fifo",
      tenantId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockedPrisma.stockLot.findMany.mockResolvedValueOnce([
      lot1, lot2, lot3,
    ]);

    await StockService.decrease(productId, 15);

    expect(mockedPrisma.stock.update)
      .toHaveBeenCalledWith({
        where: { id: stockId },
        data: {
          availableQty: { decrement: 15 },
          totalQty: { decrement: 15 },
        },
      });

    expect(mockedPrisma.stockLot.update)
      .toHaveBeenCalledWith({
        where: { id: "Lot1" },
        data: { totalQty: { decrement: 10 } },
      });

    expect(mockedPrisma.stockLot.update)
      .toHaveBeenCalledWith({
        where: { id: "Lot2" },
        data: { totalQty: { decrement: 5 } },
      });
  });

  it("should return stock ID and lot decrements", async () => {
    mockedPrisma.stock.findUnique.mockResolvedValueOnce({
      id: stockId,
      productId,
      availableQty: 30,
      totalQty: 30,
      strategy: "Fifo",
      tenantId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockedPrisma.stockLot.findMany.mockResolvedValueOnce([
      lot1, lot2, lot3,
    ]);

    const expected = success({
      stockId,
      decrements: [
        {
          stockLotId: "Lot1",
          quantity: 10,
          costPrice: 100,
        },
        {
          stockLotId: "Lot2",
          quantity: 5,
          costPrice: 110,
        },
      ],
    });

    expect(StockService.decrease(productId, 15))
      .resolves.toStrictEqual(expected);
  });

  it("should emit stock output events", async () => {
    mockedPrisma.stock.findUnique.mockResolvedValueOnce({
      id: stockId,
      productId,
      availableQty: 30,
      totalQty: 30,
      strategy: "Fifo",
      tenantId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockedPrisma.stockLot.findMany.mockResolvedValueOnce([
      lot1, lot2, lot3,
    ]);

    await StockService.decrease(productId, 15);

    expect(StockEventService.emitOutput).toHaveBeenCalledTimes(2);

    expect(StockEventService.emitOutput).toHaveBeenCalledWith({
      tenantId,
      stockId,
      stockLotId: "Lot1",
      quantity: 10,
    });

    expect(StockEventService.emitOutput).toHaveBeenCalledWith({
      tenantId,
      stockId,
      stockLotId: "Lot2",
      quantity: 5,
    });
  });

  it("sum of decrements should be equals to decrease quantity on success",
    async () => {
      mockedPrisma.stock.findUnique.mockResolvedValueOnce({
        id: stockId,
        productId,
        availableQty: 30,
        totalQty: 30,
        strategy: "Fifo",
        tenantId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockedPrisma.stockLot.findMany.mockResolvedValueOnce([
        lot1, lot2, lot3,
      ]);

      const expected = success({
        stockId,
        decrements: [
          {
            stockLotId: "Lot1",
            quantity: 10,
            costPrice: 100,
          },
          {
            stockLotId: "Lot2",
            quantity: 5,
            costPrice: 110,
          },
        ],
      });

      const result = await StockService.decrease(productId, 15);
      expect(result).toStrictEqual(expected);

      if (result.isFailure) throw new Error("Malformed test.");

      const decrementsSum = result.data.decrements
        .reduce((acc, addend) => acc + addend.quantity, 0);

      expect(decrementsSum).toBe(15);
    }
  );
});
