"use server";

import { CACHE_TAGS } from "@/config/cache-tags";
import { failure, Action, success } from "@/lib/action";
import { InternalServerError, NotFoundError } from "@/errors";
import prisma from "@/lib/prisma";
import {
  EMembershipRole,
  EPosEventStatus,
  EPosEventType,
  ESaleStatus,
  EStockEventType,
  EStockStrategy,
} from "@prisma/client";
import { revalidateTag } from "next/cache";
import { PATHS } from "@/config/paths";
import moment from "moment";
import { CurrencyFormatter } from "@/utils/formatters/currency";

type CancelPosEventActionPayload = {
  tenantId: string;
  posId: string;
  posEventId: string;
};

export const cancelPosEventAction: Action<
  CancelPosEventActionPayload
> = async ({ posEventId, posId, tenantId }) => {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) return failure(new NotFoundError("tenant not found"));

    const posEvent = await prisma.posEvent.findUnique({
      where: { id: posEventId },
      include: {
        sale: { select: { saleId: true } },
      },
    });

    if (!posEvent) return failure(new NotFoundError("pos event not found"));

    await prisma.$transaction(async (tx) => {
      await tx.posEvent.update({
        where: { id: posEvent.id },
        data: { status: EPosEventStatus.Canceled },
      });

      if (posEvent.type === EPosEventType.Sale) {
        if (!posEvent.sale)
          return failure(new InternalServerError("no associated sales"));

        const sale = await tx.sale.findUnique({
          where: { id: posEvent.sale.saleId },
          select: {
            id: true,
            customer: { select: { name: true } },
            products: {
              select: { productId: true, totalQty: true, stockLotId: true },
            },
            createdAt: true,
            paidTotal: true,
          },
        });

        if (!sale) return failure(new NotFoundError("sale not found"));

        await tx.sale.update({
          where: { id: sale.id },
          data: { status: ESaleStatus.Canceled },
        });

        const mappedProducts = await Promise.all(
          sale.products.map(async ({ productId, stockLotId, totalQty }) => {
            const product = await tx.product.findUnique({
              where: { id: productId },
              include: { stock: { select: { id: true, strategy: true } } },
            });

            if (!product?.stock)
              throw new NotFoundError("product stock not found");

            const lot = await tx.stockLot.findUnique({
              where: { id: stockLotId },
            });

            if (!lot) throw new NotFoundError("No lots in product stock");

            return {
              stockId: product.stock.id,
              stockLotId: lot.id,
              totalQty,
            };
          })
        );

        await Promise.all(
          mappedProducts.map(async ({ stockId, stockLotId, totalQty }) => {
            await tx.stock.update({
              where: { id: stockId },
              data: {
                availableQty: { increment: totalQty },
                totalQty: { increment: totalQty },
                lots: {
                  update: {
                    where: { id: stockLotId },
                    data: { totalQty: { increment: totalQty } },
                  },
                },
              },
            });

            await tx.stockEvent.create({
              data: {
                type: EStockEventType.Entry,
                tenantId,
                stockId,
                stockLotId,
                entry: {
                  create: {
                    quantity: totalQty,
                    description: `Devolução de estoque! 🔄 Retornaram ${totalQty} unidades ao lote devido ao cancelamento da venda.`,
                  },
                },
              },
            });

            revalidateTag(CACHE_TAGS.TENANT(tenantId).STOCKS.INDEX.ALL);

            revalidateTag(
              CACHE_TAGS.TENANT(tenantId).STOCKS.STOCK(stockId).EVENTS
            );
            revalidateTag(
              CACHE_TAGS.TENANT(tenantId).STOCKS.STOCK(stockId).LOTS
            );
            revalidateTag(
              CACHE_TAGS.TENANT(tenantId).STOCKS.STOCK(stockId).INDEX
            );
          })
        );

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
                body: `A loja ${
                  tenant.name
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
      }

      revalidateTag(CACHE_TAGS.TENANT(tenantId).SALES.INDEX.ALL);
      revalidateTag(CACHE_TAGS.TENANT(tenantId).STOCKS.INDEX.ALL);

      revalidateTag(CACHE_TAGS.TENANT(tenantId).POS.POS(posId).INDEX);
    });

    return success({});
  } catch (error) {
    console.error(error);
    return failure(
      new InternalServerError("unable to cancel event because error " + error)
    );
  }
};
