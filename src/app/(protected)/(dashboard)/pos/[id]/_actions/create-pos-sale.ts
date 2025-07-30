"use server";

import { CACHE_TAGS } from "@/config/cache-tags";
import { PATHS } from "@/config/paths";
import { failure, Action, success } from "@/lib/action";
import {
  InternalServerError,
  NotFoundError,
  UnprocessableEntityError,
} from "@/errors";
import prisma from "@/lib/prisma";
import { CurrencyFormatter } from "@/utils/formatters/currency";
import {
  EMembershipRole,
  EPaymentMethod,
  EPosEventType,
  ESaleMovementType,
  Prisma,
} from "@prisma/client";
import moment from "moment";
import { revalidateTag } from "next/cache";
import { StockService } from "@/domain/services/stock/stock-service";
import { InvalidParamError } from "@/errors/domain/invalid-param.error";
import { InvalidEntityError } from "@/errors/domain/invalid-entity.error";
import { InsufficientUnitsError } from "@/errors/domain/insufficient-units.error";
import { StockEventService } from "@/domain/services/stock-event/stock-event-service";

type CreatePosSaleActionPayload = {
  description: string;
  customerId: string;
  posId: string;
  products: { id: string; totalQty: number }[];
  movements: {
    type: ESaleMovementType;
    method: EPaymentMethod;
    amount: number;
  }[];
  tenantId: string;
};

export const createPosSaleAction: Action<
  CreatePosSaleActionPayload,
  unknown
> = async ({
  customerId,
  products,
  description,
  posId,
  tenantId,
  movements,
}) => {
    try {
      const [tenant, customer, pos] = await Promise.all([
        prisma.tenant.findUnique({ where: { id: tenantId } }),
        prisma.customer.findUnique({ where: { id: customerId, tenantId } }),
        prisma.pos.findUnique({ where: { id: posId, tenantId } }),
      ]);

      if (!tenant) return failure(new NotFoundError("tenant not found"));
      if (!customer) return failure(new NotFoundError("customer not found"));
      if (!pos) return failure(new NotFoundError("not found POS"));

      const TENANT_TAGS = CACHE_TAGS.TENANT(tenantId);

      // "Promise.all" execute calls serially due to single 
      // query at time per db connection within transaction.
      await prisma.$transaction(async (tx) => {
        const mappedProducts = await Promise.all(
          products.map(async ({ id, totalQty }) => {
            const product = await tx.product.findUnique({
              where: { id, active: true, deletedAt: null },
            });

            if (!product) throw new NotFoundError("product not found");

            return {
              productId: product.id,
              name: product.name,
              description: product.description,
              salePrice: product.salePrice,
              totalQty,
            };
          })
        );

        const estimatedTotal = mappedProducts.reduce(
          (sum, { salePrice, totalQty }) => sum + salePrice.toNumber() * totalQty,
          0
        );

        const paidTotal = movements
          .filter((mv) => mv.type === ESaleMovementType.Payment)
          .reduce((sum, mv) => sum + mv.amount, 0);

        const sale = await tx.sale.create({
          data: {
            customerId,
            internalCode: Math.floor(Math.random() * 0xffffff)
              .toString(16)
              .padStart(6, "0"),
            tenantId,
            estimatedTotal,
            paidTotal,
            products: {
              createMany: { data: mappedProducts },
            },
          },
        });

        const posEventSale = await tx.posEventSale.create({
          data: {
            amount: paidTotal,
            description,
            customer: { connect: { id: customerId } },
            sale: { connect: { id: sale.id } },
            products: {
              createMany: { data: mappedProducts },
            },
            posEvent: {
              create: { type: EPosEventType.Sale, posId },
            },
          } as Prisma.PosEventSaleCreateInput,
        });

        await Promise.all(
          movements.map(async ({ type, method, amount }) => {
            const baseData = { amount, method };

            const eventRef = {
              posEventSale: { connect: { id: posEventSale.id } },
            };

            const saleRef = { sale: { connect: { id: sale.id } } };

            const createData =
              type === ESaleMovementType.Change
                ? { type, change: { create: baseData } }
                : { type, payment: { create: baseData } };

            await Promise.all([
              tx.posEventSaleMovement.create({
                data: { ...eventRef, ...createData },
              }),
              tx.saleMovement.create({ data: { ...saleRef, ...createData } }),
            ]);
          })
        );

        const stockService = new StockService(tx, new StockEventService(tx));

        for (const product of mappedProducts) {
          const stockResult = await stockService.decrease({
            productId: product.productId,
            decreaseQty: product.totalQty,
            tenantId,
          });

          if (stockResult.isFailure) throw stockResult.error;
          const { decrements } = stockResult.data;

          for (const dec of decrements) {
            // Revalidate stock tags.
            const stockTag = TENANT_TAGS.STOCKS.STOCK(dec.stockId);
            revalidateTag(stockTag.INDEX);
            revalidateTag(stockTag.LOTS);
            revalidateTag(stockTag.EVENTS);
          }
        }

        // Revalidate current page of Stock's table.
        revalidateTag(TENANT_TAGS.STOCKS.INDEX.ALL);
        // Revalidate Products listing.
        revalidateTag(TENANT_TAGS.PRODUCTS.INDEX.ALL);

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
                subject: `Venda feita para ${customer.name}! 💰`,
                body: `A loja ${tenant.name} vendeu ${CurrencyFormatter.format(
                  paidTotal
                )} às ${moment(sale.createdAt).format("HH:mm")} do dia ${moment(
                  sale.createdAt
                ).format("DD/MM/YYYY")}. Bora conferir os detalhes?`,
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
            revalidateTag(TENANT_TAGS.SALES.INDEX.ALL);
          }
        }

        revalidateTag(TENANT_TAGS.POS.POS(posId).INDEX);
      });

      return success({});
    } catch (error) {
      console.error(`CreatePosSale: ${JSON.stringify(error)}`);

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
        new InternalServerError(
          "cannot create a new pos sale event because error: " + error
        )
      );
    }
  };
