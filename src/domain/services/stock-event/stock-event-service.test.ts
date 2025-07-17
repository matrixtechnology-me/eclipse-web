import { InvalidParamError } from '@/errors/domain/invalid-param.error';
import { failure } from '@/utils/types/either';
import { describe, expect, it, vi, Mock as VitestMock } from 'vitest'
import { StockEventService } from './stock-event-service';
import mockedPrisma from '@/lib/__mocks__/prisma';
import { beforeEach } from 'node:test';

const [tenantId, stockId, stockLotId] = ["T_ID", "S_ID", "SL_ID"];;

vi.mock("@/lib/prisma");

beforeEach(() => {
  // Mock create event mutation.
  (mockedPrisma.stockEvent.create as VitestMock).mockResolvedValue(undefined);
});

describe("StockEventService.emitOutput", () => {
  it("should throw an error if quantity is lower or equals to zero.", () => {
    const expected =
      failure(new InvalidParamError("Quantity must be greater than zero."));

    expect(StockEventService.emitOutput({
      tenantId,
      stockId,
      stockLotId,
      quantity: 0,
    })).resolves.toStrictEqual(expected);

    expect(StockEventService.emitOutput({
      tenantId,
      stockId,
      stockLotId,
      quantity: -15,
    })).resolves.toStrictEqual(expected);

    expect(StockEventService.emitOutput({
      tenantId,
      stockId,
      stockLotId,
      quantity: -43.873,
    })).resolves.toStrictEqual(expected);

    expect(mockedPrisma.stockEvent.create).not.toHaveBeenCalled();
  });
});
