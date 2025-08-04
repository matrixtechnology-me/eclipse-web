"use server";

import { CACHE_TAGS } from "@/config/cache-tags";
import { PATHS } from "@/config/paths";
import { StockEventService } from "@/domain/services/stock-event/stock-event-service";
import { InternalServerError, NotFoundError } from "@/errors";
import { Action, failure, success } from "@/lib/action";
import prisma from "@/lib/prisma";
import { CurrencyFormatter } from "@/utils/formatters/currency";
import {
  EMembershipRole,
  EPosEventStatus,
  EPosEventType,
  ESaleStatus,
} from "@prisma/client";
import moment from "moment";
import { revalidateTag } from "next/cache";

type CancelPosSaleActionPayload = {
  tenantId: string;
  posId: string;
  posEventId: string;
};

export const cancelPosSaleAction: Action<
  CancelPosSaleActionPayload
> = async ({ posEventId, posId, tenantId }) => {
  try {

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) return failure(new NotFoundError("tenant not found"));

    await prisma.$transaction(async (tx) => {
      // Find and Update PosEvent.
      const posEvent = await prisma.posEvent.update({
        data: {
          status: EPosEventStatus.Canceled,
          updatedAt: new Date(),
        },
        where: {
          id: posEventId,
          posId,
          type: EPosEventType.Sale,
        },
        include: { sale: true },
      });

      if (!posEvent) return failure(new NotFoundError("pos event not found"));
      if (!posEvent.sale) return failure(new NotFoundError("no associated sale"));

      // Find and Update Sale.
      const sale = await tx.sale.update({
        data: {
          status: ESaleStatus.Canceled,
          updatedAt: new Date(),
        },
        where: { id: posEvent.sale.saleId },
        select: {
          id: true,
          customer: { select: { name: true } },
          products: {
            select: {
              stockLotUsages: true,
            },
          },
          createdAt: true,
          paidTotal: true,
        },
      });

      if (!sale) return failure(new NotFoundError("sale not found"));

      const stockIncrements = new Map<string, number>();
      const stockEventService = new StockEventService(tx);

      for (const item of sale.products) {
        // Increment StockLots.
        for (const lotUsage of item.stockLotUsages) {
          const stockLot = await tx.stockLot.update({
            data: {
              totalQty: { increment: lotUsage.quantity },
              updatedAt: new Date(),
            },
            where: { id: lotUsage.stockLotId },
          });

          const base = stockIncrements.get(stockLot.stockId) ?? 0;
          stockIncrements.set(stockLot.stockId, base + lotUsage.quantity);

          // StockEventEntry for lot increment.
          await stockEventService.emitInput({
            tenantId,
            quantity: lotUsage.quantity,
            stockLotId: stockLot.id,
            stockId: stockLot.stockId,
          });
        }
      }

      const tenantTags = CACHE_TAGS.TENANT(tenantId);

      // Increment Stocks.
      for (const [stockId, increment] of stockIncrements) {
        await tx.stock.update({
          where: { id: stockId },
          data: {
            availableQty: { increment },
            totalQty: { increment },
          },
        });

        const stockTag = tenantTags.STOCKS.STOCK(stockId);
        revalidateTag(stockTag.EVENTS);
        revalidateTag(stockTag.LOTS);
        revalidateTag(stockTag.INDEX);
      }

      revalidateTag(tenantTags.STOCKS.INDEX.ALL);

      const tenantOwner = await tx.tenantMembership.findFirst({
        where: { tenantId, membership: { role: EMembershipRole.Owner } },
        select: { membership: { select: { userId: true } } },
      });

      if (tenantOwner) {
        const userTenantSettings = await tx.userTenantSettings.findUnique({
          where: {
            userId_tenantId: {
              tenantId,
              userId: tenantOwner.membership.userId,
            },
          },
        });

        if (!userTenantSettings?.doNotDisturb) {
          await tx.notification.create({
            data: {
              subject: `Venda cancelada para ${sale.customer.name}! ❌`,
              body: `A loja ${tenant.name
                } cancelou uma venda de ${CurrencyFormatter.format(
                  sale.paidTotal.toNumber()
                )} realizada às ${moment(sale.createdAt).format(
                  "HH:mm"
                )} do dia ${moment(sale.createdAt).format("DD/MM/YYYY")}.`,
              href: PATHS.PROTECTED.DASHBOARD.SALES.SALE(sale.id).INDEX,
              targets: {
                createMany: {
                  data: [{ tenantId, userId: tenantOwner.membership.userId }],
                  skipDuplicates: true,
                },
              },
            },
          });

          revalidateTag(
            CACHE_TAGS.USER_TENANT(tenantOwner.membership.userId, tenantId)
              .NOTIFICATIONS
          );
        }
      }

      revalidateTag(tenantTags.SALES.INDEX.ALL);
      revalidateTag(tenantTags.STOCKS.INDEX.ALL);
      revalidateTag(tenantTags.POS.POS(posId).INDEX);
    });

    return success({});
  } catch (error) {
    console.error(error);
    return failure(
      new InternalServerError("unable to cancel event because error " + error)
    );
  }
};
